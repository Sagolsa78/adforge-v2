/**
 * AgentThoughtsPopover Component Props
 */
import { DiscoveryStatus } from "@/interfaces/discovery";

export interface AgentThoughtsPopoverProps {
  thoughts: string[];
  status: DiscoveryStatus;
  onClose: () => void;
}
