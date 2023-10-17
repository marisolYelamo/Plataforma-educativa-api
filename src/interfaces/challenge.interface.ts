export interface IUserChallenge {
  id: number;
  UserId: number;
  score: number;
  ContentId: number;
  ChallengeId: string;
  isApproved: boolean;
  tryNumber: number;
}
