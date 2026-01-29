/**
 * Branded types for IDs to prevent accidental mixing of different ID types.
 * These act like nominal types in a structural typing system.
 */

export type Brand<K, T> = K & { __brand: T };

export type UserID = Brand<string, 'UserID'>;
export type PostID = Brand<string, 'PostID'>;
export type CarouselID = Brand<string, 'CarouselID'>;
export type SubscriptionID = Brand<string, 'SubscriptionID'>;
export type StripeCustomerID = Brand<string, 'StripeCustomerID'>;

/**
 * Type guards to cast strings to branded IDs
 */
export const asUserID = (id: string) => id as UserID;
export const asPostID = (id: string) => id as PostID;
export const asCarouselID = (id: string) => id as CarouselID;
export const asSubscriptionID = (id: string) => id as SubscriptionID;
export const asStripeCustomerID = (id: string) => id as StripeCustomerID;
