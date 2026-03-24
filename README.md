# Banker's Algorithm ATM Simulator

A simple project that simulates real-world resource allocation (like an ATM network) using **Banker's Algorithm** to prevent deadlocks.

This web app demonstrates how resource requests are granted only when the system remains in a **safe state**.

## Features

- Simulates processes (ATM sessions/customers) and limited resource types.
- Displays **Max**, **Allocation**, **Need**, and **Available** matrices.
- Accepts user resource requests and validates them with Banker's Algorithm.
- Denies unsafe requests to avoid deadlock.
- Logs each request outcome (granted/wait/denied).

## Tech Stack

- HTML
- CSS
- JavaScript (Vanilla)

## Project Structure

```text
.
|- index.html
|- style.css
|- script.js
|- README.md
|- LICENSE
|- .gitignore
|- CONTRIBUTING.md
|- ISSUE_TEMPLATE.md
```

## How to Run Locally

1. Clone this repository:

   ```bash
   git clone https://github.com/rohitselote/Banker-s-Algorithm-Simulator.git
   cd Banker-s-Algorithm-Simulator
   ```

2. Open `index.html` in your browser.

No build steps or dependencies are required.

## How the Algorithm Works (Short)

1. Compute `Need = Max - Allocation`.
2. For each request:
   - Check `Request <= Need`
   - Check `Request <= Available`
   - Tentatively allocate resources
   - Run safe-state check
3. Grant only if the resulting state is safe.

## Example Use Case

- A process requests resources `[1, 0, 2]`.
- If the temporary allocation still allows all processes to complete in some order, the request is granted.
- Otherwise, the request is denied to avoid unsafe states.

## Screenshots

Add screenshots here after publishing:

- `docs/home.png`
- `docs/request-granted.png`
- `docs/request-denied.png`

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` first.

## License

This project is licensed under the MIT License. See `LICENSE`.

