# Backend API Reference

## 1. Base URL and Auth

**Base URL:** `https://content.bhuexpert.com/api/v1/data`

**Authentication:**
We rely on Supabase emitted JWTs. For secured endpoints, you must include the Authorization header.

```HTTP
Authorization: Bearer <access_token>
```

_Token Expiry: Tokens typically expire in 1 hour. Use the standard Supabase `refreshSession()` capabilities provided in the client SDK to ensure continuous functionality._

---

## 2. Authentication Endpoints

These endpoints are standard Supabase calls but generally mapped through our service for uniformity if required, but primarily interaction handles directly via `@supabase/supabase-js`.

### `POST /auth/signup`

**Description:** Registers a new user with standard credentials.

### `POST /auth/signin`

**Description:** Authenticates a user returning a valid JWT.

---

## 3. Brand Endpoints

This collection handles the core logic of plug and playa gents: scraping context, returning data, and generating ad creative.

### `POST /brands`

**Description:** Initializes a background scrape and analysis task for a given URL. Returns a persistent stream of Server-Sent Events (SSE).

**Auth Requirement:** None (Guest permitted)

**SSE Event Format Reference:**

| Event                 | Meaning                                   | Fields present                     |
| --------------------- | ----------------------------------------- | ---------------------------------- |
| `step`                | A general process update                  | `step`, `message`, `progress`      |
| `scraping_started`    | Scrape operation commenced                | `step`, `message`, `progress`      |
| `extracting_signals`  | Analyzing the DOM for signals             | `step`, `message`, `progress`      |
| `analysing_tone`      | Tone assessment running                   | `step`, `message`, `progress`      |
| `generating_contexts` | Producing the 5 main contexts             | `step`, `message`, `progress`      |
| `brand_created`       | Task successfully reached DB insertion    | `step`, `brand_id`, `progress`     |
| `completed`           | Full analysis routine finished            | `step`, `message`, `progress: 100` |
| `error`               | Terminal failure occurred during pipeline | `step`, `message`                  |

---

### `GET /brands/{id}/context`

**Description:** Retrieves the completed context analysis payload structured in Markdown format.

**Auth Requirement:** Bearer (Valid Token Required for non-public instances)
**Response Details:** Contains `context_md` string field.

---

### `POST /brands/{id}/claim`

**Description:** Claims a brand entity originally created as a guest and links it to the newly authenticated user.

**Auth Requirement:** Bearer Token required.
**Request Body:** None required. The authorization token header inherently maps the user ID.

---

### `POST /brands/{id}/ad-variations`

**Description:** Triggers the AI generation pipeline to produce ad variations strictly adhering to the selected context matrix.

**Auth Requirement:** Bearer Token required.
**Response Format:** Array of generated ad objects (Headlines, Body, CTA).

**Payload Requirements:**
| Field | Type | Description |
|---|---|---|
| `context_index` | Integer | (1-5) Direct mapping to selected UI context card. |
| `platform` | String | Target platform (e.g., 'LinkedIn', 'Instagram') |
| `tone` | String | Target communication style. |
| `template` | String | Underlying ad template style requested. |

---

## 4. Context Index Reference

When the `context_md` string is split locally, we present 5 cards. Sending back an index between 1 and 5 defines the focus area for Ad Generator AI:

| `context_index` | Represented Content Area             |
| --------------- | ------------------------------------ |
| 1               | Brand Overview / General Positioning |
| 2               | Target Audience Analysis             |
| 3               | Core Value Proposition               |
| 4               | Brand Tone & Voice Instructions      |
| 5               | Key Market Differentiators           |

---

## 5. Error Handling

All specific endpoints will respond leveraging standardized HTTP statuses:

- `200` / `201`: Success / Resource Created
- `400`: Bad Request (Malformed body or bad parameters)
- `401`: Unauthorized (Missing/expired Bearer token)
- `403`: Forbidden (Attempting to act on a brand you do not own)
- `404`: Not Found (Invalid Brand ID)
- `409`: Conflict (Attempting to claim an already claimed brand entity)
- `500`: Internal Server Error

A consistent JSON format is typically returned describing the error directly, which `lib/api.ts` parses and surfaces to the UI gracefully.
