import { UUID } from "crypto";

export enum userRoles {
	studen = 1,
	partner = 2,
	stuff = 3
}

export interface User {
	id: UUID
	role: userRoles
	username: string;
	password_hash: string;
}

export type JWTPayload = Pick<User, 'id' | 'role'>

// export interface UserStats {
// 	m_wins: number,
// 	m_losses: number,
// 	t_wins: number,
// 	t_losses: number,
// 	s_wins: number,
// 	s_losses: number,
// }

// export type GameMode = 'singleplayer' | 'multiplayer' | 'tournament'

// export interface PlayerStats {
// 	username: string,
// 	wins: number,
// 	losses: number,
// 	win_rate: number,
// }

// export type TopPlayers = {
// 	singleplayer: PlayerStats[] | null;
// 	multiplayer: PlayerStats[] | null;
// 	tournament: PlayerStats[] | null;
// }

// export interface Friend {
// 	name: string;
// 	picture: string;
// }

// export interface FriendChat extends Friend {
// 	online: boolean;
// 	blocked: string | null;
// }

// export interface SidebarResponse {
// 	friends: {
// 		online: Friend[];
// 		offline: Friend[];
// 		// online: (Friend & { unreadMessages: boolean})[];
// 		// offline: (Friend & { unreadMessages: boolean})[];
// 	}
// 	FriendRequests: Friend[];
// }

// export interface Message {
// 	text: string;
// 	owner: string
// }

// export interface MessageToServer {
// 	text: string;
// 	to: string
// }


// export interface ChatInitResponse {
// 	messages: Message[];
// 	friend: FriendChat;
// 	gameInvite: boolean;
// }
