# TFX Popup Recipe Demo

This project demonstrates a secure implementation of third-party popup windows for OTP (One-Time Password) verification flows, similar to what you might encounter in real-world payment gateways. All essential functionality is included, without focusing on specific design or styling details.

## Why This Works

1. **Popup Blocking Prevention**

   - The popup is opened directly in response to a user action (button click)
   - Initial URL is on the same domain (loading page)

## Architecture Overview

The application consists of several key components working together to enable a secure and user-friendly verification flow:

1. **Deposit Page** (`/app/deposit/page.tsx`):

   - Hosts an `<iframe>` pointing to the external deposit page.
   - Uses the PopupManager to open a new window for OTP verification.
   - Updates the status (idle, pending, success, error, cancelled, closed) after receiving messages from the popup.

2. **External Deposit IFrame** (`/app/external-deposit/page.tsx`):

   - Runs inside the deposit page's `<iframe>`.
   - Requests an OTP popup by sending a postMessage to the parent window.
   - Receives verification results from the parent (success, cancellation, or errors).

3. **Third-Party Bank Simulation** (`/app/thirdparty-bank/page.tsx`):

   - Demonstrates how a real third-party interface could handle an OTP input.
   - Operates solely through callback URLs or other mechanisms, without direct control from the main application.
   - In this demo, a code of "1234" triggers a successful verification.

4. **Popup Manager** (`/lib/PopupManager.ts`):
   - Handles various environments (desktop, mobile, in-app).
   - Monitors user actions such as manual window closure or cancellation.
   - Passes relevant status updates (onSuccess, onCancel, onError) back to the calling code.

## Communication Flow

1. **External Deposit IFrame**: Sends a postMessage to the parent page requesting an OTP popup.
2. **Parent Page (Deposit)**: Invokes the PopupManager to open the bank page in a new window.
3. **Third-Party Bank Page**: Prompts the user for an OTP and, on success, returns a status or calls a callback URL.
4. **PopupManager**: Detects the result (e.g., success/cancellation) and notifies the parent page.
5. **Parent Page**: Updates the IFrame (External Deposit) with the final status (verified, cancelled, etc.).

## Status Management

The application tracks several verification states:

- **idle** (nothing started yet)
- **pending** (OTP verification in progress)
- **success** (OTP verified)
- **error** (verification failed or invalid OTP)
- **cancelled** (verification aborted by user)
- **closed** (popup manually closed)

These states help inform the user about what is happening in each step of the flow.

## Implementation Details

### Window Creation and Management

- **Environment Detection**: Handles cases where the app runs on desktop or mobile.

### Message Handling

- **Parent-to-Popup**: The main deposit page opens and configures the third-party bank page.
- **Popup-to-Parent**: The bank page (or third-party site) sends success or error notifications through callbacks or postMessage.
- **Iframe Updates**: The deposit page relays results to the external deposit page for display.

## Third-Party Simulation

The `/thirdparty-bank/page.tsx` file simulates how a real-world third-party page might work:

- Receives configuration or callback URL.
- Displays an OTP entry prompt.
- Redirects back or passes a success/failure response to the parent app.
- Demonstrates integration through minimal or no direct postMessage once loaded, relying on URL-based callbacks instead.

## Notes

- The third-party bank page here is only a simulation; a real banking site would be separate, using secure guidelines.
- OTP and URL callback integration are demonstrated for clarity, without focusing on a specific design.
- The Spinner, icons, or styling are included solely to illustrate loading and status changes and can be replaced with any other approach.
- The loading timeout in PopupManager simulates a real-world scenario where the application needs to perform background tasks (like HTTP requests, token generation, or session validation) before redirecting to the actual bank URL.

This setup can be adapted to real-world integration scenarios where a third-party website controls the verification process.
