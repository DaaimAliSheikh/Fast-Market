const errorMessages: Map<string, string> = new Map<string, string>([
  [
    "auth/email-already-in-use",
    "This email address is already associated with another account.",
  ],
  ["auth/invalid-email", "Please enter a valid email address."],
  [
    "auth/operation-not-allowed",
    "Sorry, this account type is currently disabled.",
  ],
  [
    "auth/weak-password",
    "Your password is too weak. Please choose a stronger password.",
  ],
  [
    "auth/user-disabled",
    "This account has been disabled. Please contact support for assistance.",
  ],
  [
    "auth/user-not-found",
    "No account found with this email. Please sign up first.",
  ],
  [
    "auth/wrong-password",
    "Incorrect password. Please try again or reset your password.",
  ],
  [
    "auth/too-many-requests",
    "Too many unsuccessful login attempts. Please try again later.",
  ],
  [
    "auth/requires-recent-login",
    "Please log in again to perform this sensitive operation.",
  ],
  [
    "auth/network-request-failed",
    "Network error. Please check your internet connection and try again.",
  ],
  [
    "auth/popup-closed-by-user",
    "The popup was closed before completing the sign-in. Please try again.",
  ],
  [
    "auth/account-exists-with-different-credential",
    "An account already exists with the same email but different sign-in credentials.",
  ],
  // Add other error messages as needed
]);
export default errorMessages;
