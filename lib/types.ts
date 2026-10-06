export type UpdateUserBasicSettingsInputEmail = {
	id: string;
	email: string;
};
export type UpdateUserBasicSettingsInputName = {
	id: string;
	firstName: string;
};

export type UpdateUserBasicSettingsInput = {
	id: string;
	firstName: string;
	email: string;
};

export type { Locale } from "@/i18n-config";
export type Variant = "money" | "love" | "luck" | "soul" | "dream";

export type UserBasicSettingsInput = {
	firstName: string;
	email: string;
};
type Like = {
    id: string;
    userId: string;
    slotId: string;
    createdAt: Date;
}
export type AnySlot = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	expiresAt: Date;
	personalNum: number;
	deletedAt: Date | null;
	userText: string | null;
	likes: Like[];
};

export type SlotItem = {
	variant: Variant;
	days: number;
	text?: string;
	personalNum?: number;
};

export type SlotOrder = SlotItem & {
	personalNum: number;
};

export type BuyResult = {
	id: string;
	userId: string;
	createdAt: Date;
	expiresAt: Date;
	userText: string | null;
	updatedAt: Date;
	personalNum: number;
	deletedAt: Date | null;
	variant: Variant;
};

export type BoardAssignmentItem = {
	itemId: string;
	variant: Variant;
	personalNum: number;
	userId: string;
	userName: string;
	userEmail: string;
	userText: string | null;
	expiresAt: Date;
	createdAt: Date;
	deletedAt: Date | null;
	deletedReason: string | null;
};

export type ConflictItem = {
	variant?: Variant | "root";
	personalNum?: number;
	message: string;
	heldUntil?: Date;
};

export type Assignment = {
  id: string;              
  personalNum: number;
  userId: string;
  userName: string;
  userText?: string | null;
  expiresAt: Date;
  createdAt: Date | string;
  likes: number;          
  likedByMe: boolean;     
}

export type TopByBoard = {
  money: Assignment[];
  love: Assignment[];
  luck: Assignment[];
  soul: Assignment[];
  dream: Assignment[];
};

export type PopularCell = {
	variant: string;
	id: string;
	personalNum: number;
	userId: string;
	userName: string;
	userText?: string | null | undefined;
	expiresAt: Date;
	createdAt: string | Date;
	likes: number;
	likedByMe: boolean;
}
