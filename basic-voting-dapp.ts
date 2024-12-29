// contracts/VotingSystem.ts
import { App, Primitive, Context, Response } from "@andromedaprotocol/andromeda-js";

interface VoteState {
  proposals: Map<string, number>;
  hasVoted: Set<string>;
}

class VotingSystem extends App {
  private state: VoteState = {
    proposals: new Map(),
    hasVoted: new Set()
  };

  // Initialize the contract with proposals
  public instantiate(ctx: Context, proposals: string[]): Response {
    proposals.forEach(proposal => {
      this.state.proposals.set(proposal, 0);
    });
    
    return Response.success("Voting system initialized");
  }

  // Cast a vote for a proposal
  public vote(ctx: Context, proposal: string): Response {
    const sender = ctx.sender;
    
    // Check if proposal exists
    if (!this.state.proposals.has(proposal)) {
      return Response.error("Invalid proposal");
    }
    
    // Check if user has already voted
    if (this.state.hasVoted.has(sender)) {
      return Response.error("Already voted");
    }
    
    // Record vote
    const currentVotes = this.state.proposals.get(proposal) || 0;
    this.state.proposals.set(proposal, currentVotes + 1);
    this.state.hasVoted.add(sender);
    
    return Response.success("Vote recorded successfully");
  }

  // Query vote counts
  public getResults(ctx: Context): Response {
    const results: Record<string, number> = {};
    this.state.proposals.forEach((votes, proposal) => {
      results[proposal] = votes;
    });
    
    return Response.success({ results });
  }

  // Check if an address has voted
  public hasVoted(ctx: Context, address: string): Response {
    return Response.success({
      hasVoted: this.state.hasVoted.has(address)
    });
  }
}

export default VotingSystem;
