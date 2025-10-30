export const fields = [
   "id",
   "name",
   "username",
   "account_type",
   "website",
   "media_count",
   "followers_count",
   "follows_count",
   "biography",
   "profile_picture_url",

   // "is_published",
   // "has_profile_pic",
   // "alt_text",
   // "shopping_product_tag_eligibility"
] as const

export type Fields = typeof fields[number]
