/**
 * AgentThoughtsPopup Component Props
 */
import { DiscoveryStatus } from "@/interfaces/discovery";

export interface AgentThoughtsPopupProps {
  thoughts: string[];
  status: DiscoveryStatus;
  isOpen: boolean;
  onClose: () => void;
}
