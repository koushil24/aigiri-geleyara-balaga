// =====================================================
// AIGIRI MEMBER PORTAL - settings
// This file holds the member password as a scrambled
// code (SHA-256 hash), NOT the password itself.
//
// HOW TO SET OR CHANGE THE PASSWORD:
//  1. Open  your-website/member.html?setup
//  2. Type the new password and tap "Copy code"
//  3. Paste the code between the quotes below, then commit
//
// IMPORTANT: this is only a simple gate for casual visitors.
// Anyone who studies the website's code can get around it,
// so never put private member data in the website files.
// A real login (Firebase / Supabase) comes in a later version.
// =====================================================
const MEMBER_CONFIG = {
    passwordHash: ""
};
