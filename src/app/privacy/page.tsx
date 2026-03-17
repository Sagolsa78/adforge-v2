"use client";

import { Box, Container, Text, VStack, Heading, Link, Flex } from "@chakra-ui/react";
import { Separator } from "@chakra-ui/react";
import NextLink from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="4xl">
        <VStack align="stretch" gap={8} bg="white" p={8} borderRadius="2xl" boxShadow="sm">
          {/* Header */}
          <Box>
            <Heading as="h1" fontSize="3xl" fontWeight="700" color="gray.900" mb={2}>
              Privacy Policy
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Last Updated: March 17, 2026
            </Text>
          </Box>

          <Separator my={8} />

          {/* Introduction */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              1. Introduction
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              PostGini ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our social media management platform and related services (collectively, the "Service").
            </Text>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7">
              By using PostGini, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
            </Text>
          </Box>

          {/* Information We Collect */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              2. Information We Collect
            </Heading>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                2.1 Personal Information
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                When you create an account, we collect:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Email address</li>
                <li>Name</li>
                <li>Password (encrypted)</li>
                <li>Profile information</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                2.2 Social Media Account Information
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                When you connect social media accounts (Facebook, Instagram, etc.), we collect:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Public profile information from connected platforms</li>
                <li>Page information and permissions you grant</li>
                <li>Content you publish through our Service</li>
                <li>Engagement metrics and analytics data</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                2.3 Usage Data
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                We automatically collect information about how you use our Service:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and access times</li>
                <li>Pages visited and features used</li>
                <li>Click patterns and interactions</li>
              </Box>
            </Box>
          </Box>

          {/* How We Use Your Information */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              3. How We Use Your Information
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              We use the collected information for the following purposes:
            </Text>
            <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
              <li>To provide, maintain, and improve our Service</li>
              <li>To publish content to your connected social media accounts</li>
              <li>To send you technical notices and support messages</li>
              <li>To respond to your comments and questions</li>
              <li>To develop new features and services</li>
              <li>To monitor and analyze trends, usage, and activities</li>
              <li>To detect, investigate, and prevent fraudulent transactions</li>
              <li>To personalize your experience</li>
            </Box>
          </Box>

          {/* Data Sharing */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              4. How We Share Your Information
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              We do not sell your personal information. We may share your information in the following circumstances:
            </Text>
            <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
              <li><strong>With Social Media Platforms:</strong> When you connect and publish content through platforms like Facebook and Instagram</li>
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (hosting, analytics, customer support)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
            </Box>
          </Box>

          {/* Meta Platforms Compliance */}
          <Box bg="blue.50" p={5} borderRadius="xl" border="1px solid" borderColor="blue.100">
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              5. Meta Platforms (Facebook & Instagram) Compliance
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              PostGini integrates with Meta Platforms, Inc. services including Facebook and Instagram. This section outlines our compliance with Meta's Platform Terms and Data Use Policy.
            </Text>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                5.1 Data We Receive from Meta
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                When you connect your Facebook or Instagram account, we receive:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Public profile information (name, profile picture)</li>
                <li>Page information for Pages you manage</li>
                <li>Instagram Business account information</li>
                <li>Content publishing permissions</li>
                <li>Basic analytics and insights data</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                5.2 How We Use Meta Data
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                We use data received from Meta Platforms solely for:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Publishing content to your connected Facebook Pages and Instagram accounts</li>
                <li>Providing analytics and performance insights</li>
                <li>Improving our content scheduling and management features</li>
                <li>Authenticating your identity and account permissions</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                5.3 Meta Data Restrictions
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                We do not:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Sell or transfer your Meta data to third parties (except as required for service provision)</li>
                <li>Use Meta data for unrelated advertising or marketing purposes</li>
                <li>Retain Meta data longer than necessary for service provision</li>
                <li>Use Meta data to create user profiles for ad targeting</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                5.4 Disconnecting Meta Accounts
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                You can disconnect your Facebook or Instagram account at any time:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Go to Dashboard → Integrations</li>
                <li>Click "Disconnect" on the connected platform card</li>
                <li>Alternatively, revoke access via Facebook Settings → Apps and Websites</li>
              </Box>
            </Box>
          </Box>

          {/* Data Retention */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              6. Data Retention
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              We retain your personal information for as long as necessary to:
            </Text>
            <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
              <li>Provide our Service and maintain your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
            </Box>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mt={3}>
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
            </Text>
          </Box>

          {/* Your Rights */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              7. Your Rights and Choices
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              Depending on your location, you may have the following rights:
            </Text>
            <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </Box>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mt={3}>
              To exercise these rights, contact us at{" "}
              <Link href="mailto:privacy@postgini.com" color="blue.600">
                privacy@postgini.com
              </Link>
              .
            </Text>
          </Box>

          {/* Account Deletion */}
          <Box bg="red.50" p={5} borderRadius="xl" border="1px solid" borderColor="red.100">
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              8. Account Deletion
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              You have the right to delete your PostGini account at any time. We provide two methods for account deletion:
            </Text>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                8.1 Self-Service Deletion
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                Delete your account instantly through your dashboard:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Log in to your PostGini account</li>
                <li>Go to Settings → Account Settings</li>
                <li>Click "Delete Account"</li>
                <li>Confirm deletion by entering your password</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                8.2 Direct Deletion Link
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                You can also delete your account directly using this link:
              </Text>
              <Box bg="white" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" mb={3}>
                <Link
                  href="/settings/delete-account"
                  color="red.600"
                  fontWeight="600"
                  textDecoration="underline"
                >
                  Delete My Account
                </Link>
              </Box>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7">
                This link requires you to be logged in. If you cannot access your account, contact support for assistance.
              </Text>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                8.3 What Happens When You Delete
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
                Upon account deletion:
              </Text>
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>Your personal information will be deleted within 30 days</li>
                <li>All connected social media accounts will be disconnected</li>
                <li>Scheduled posts will be cancelled</li>
                <li>Your brand data and content will be permanently removed</li>
                <li>Analytics and historical data will be deleted</li>
              </Box>
            </Box>

            <Box ml={4} mt={4}>
              <Heading as="h3" fontSize="md" fontWeight="600" color="gray.800" mb={2}>
                8.4 Data Retention After Deletion
              </Heading>
              <Text fontSize="14px" color="gray.700" lineHeight="1.7">
                We may retain certain information for legal compliance, fraud prevention, or legitimate business purposes as required by law. This includes transaction records, log data, and information required for tax purposes.
              </Text>
            </Box>
          </Box>

          {/* Security */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              9. Data Security
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              We implement appropriate technical and organizational measures to protect your personal information:
            </Text>
            <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
              <li>Encryption of data in transit (TLS/SSL)</li>
              <li>Secure storage of sensitive data</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </Box>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mt={3}>
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </Text>
          </Box>

          {/* Children's Privacy */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              10. Children's Privacy
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7">
              Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete that information.
            </Text>
          </Box>

          {/* Changes to Privacy Policy */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              11. Changes to This Privacy Policy
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </Text>
            <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending you an email notification for significant changes</li>
            </Box>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mt={3}>
              We encourage you to review this Privacy Policy periodically for any changes.
            </Text>
          </Box>

          {/* Contact Us */}
          <Box>
            <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
              12. Contact Us
            </Heading>
            <Text fontSize="14px" color="gray.700" lineHeight="1.7" mb={3}>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </Text>
            <Box bg="gray.50" p={4} borderRadius="lg">
              <Box as="ul" ml={5} fontSize="14px" color="gray.700" lineHeight="1.8">
                <li>
                  Email:{" "}
                  <Link href="mailto:privacy@postgini.com" color="blue.600">
                    privacy@postgini.com
                  </Link>
                </li>
                <li>
                  Support:{" "}
                  <Link href="mailto:support@postgini.com" color="blue.600">
                    support@postgini.com
                  </Link>
                </li>
              </Box>
            </Box>
          </Box>

          {/* Meta Platform Disclaimer */}
          <Box bg="gray.50" p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Text fontSize="12px" color="gray.600" lineHeight="1.6">
              <strong>Meta Platform Disclaimer:</strong> This application uses the Meta Platform APIs. Your use of our application is subject to Meta's Platform Terms and Data Use Policy. Meta does not endorse or verify the accuracy of our application's services. For questions about Meta's data practices, please review Meta's Privacy Policy at{" "}
              <Link href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" color="blue.600">
                facebook.com/privacy/policy
              </Link>
              .
            </Text>
          </Box>

          {/* Footer Links */}
          <Separator my={6} />

          <Box textAlign="center">
            <Text fontSize="13px" color="gray.500" mb={3}>
              This Privacy Policy is compliant with GDPR, CCPA, and Meta Platform requirements.
            </Text>
            <Flex gap={4} justify="center" flexWrap="wrap">
              <Link as={NextLink} href="/privacy" color="blue.600" fontWeight="500">
                Privacy Policy
              </Link>
              <Link as={NextLink} href="/terms" color="blue.600" fontWeight="500">
                Terms of Service
              </Link>
              <Link as={NextLink} href="/settings/delete-account" color="red.600" fontWeight="500">
                Delete Account
              </Link>
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
