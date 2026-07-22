## 👨‍💻 Frontend Developer Info

- **Name:** Sayeed Shorif  
- **Tech Stack:** React, GSAP, Tailwind CSS 

---

## 📦 Packages & Installation

Here are the packages used in this project along with their installation commands.

### Dependencies
Core packages required for the application to run:

- **@emailjs/browser** `npm install @emailjs/browser`
- **@gsap/react** `npm install @gsap/react`
- **@tailwindcss/vite** `npm install @tailwindcss/vite`
- **gsap** `npm install gsap`
- **lucide-react** `npm install lucide-react`
- **react** `npm install react`
- **react-dom** `npm install react-dom`
- **react-router** `npm install react-router`
- **tailwindcss** `npm install tailwindcss`

### Dev Dependencies
Packages used for development, building, and linting:

- **@eslint/js** `npm install -D @eslint/js`
- **@types/react** `npm install -D @types/react`
- **@types/react-dom** `npm install -D @types/react-dom`
- **@vitejs/plugin-react** `npm install -D @vitejs/plugin-react`
- **eslint** `npm install -D eslint`
- **eslint-plugin-react-hooks** `npm install -D eslint-plugin-react-hooks`
- **eslint-plugin-react-refresh** `npm install -D eslint-plugin-react-refresh`
- **globals** `npm install -D globals`
- **vite** `npm install -D vite`

### 🚀 Quick Install

If you want to install everything at once, use the following commands:

**Install all dependencies:**
```bash
npm install @emailjs/browser @gsap/react @tailwindcss/vite gsap lucide-react react react-dom react-router tailwindcss
```
## 📅 Animation Plugins Used

- **ScrollTrigger** – Handles scroll-based animations  
- **useGSAP** – Integrates GSAP with React lifecycle  
- **SplitText** – Enables advanced text animations  
- **Flip** – Animates layout transitions smoothly  


## EmailJS Template  Set Up

```

<div style="font-family: system-ui, sans-serif, Arial; font-size: 13px; line-height: 1.5; color: #333;">
  
  <div>
    📩 You received a new message from your portfolio website.
  </div>

  <div
    style="
      margin-top: 20px;
      padding: 15px 0;
      border-top: 1px dashed #ccc;
      border-bottom: 1px dashed #ccc;
    "
  >
    <table role="presentation">
      <tr>
        <td style="vertical-align: top">
          <div
            style="
              padding: 8px 12px;
              margin-right: 12px;
              background-color: #eef6ff;
              border-radius: 6px;
              font-size: 22px;
            "
          >
            👤
          </div>
        </td>

        <td style="vertical-align: top">
          <div style="color: #2c3e50; font-size: 16px; font-weight: bold;">
            New Contact Message
          </div>

          <p style="margin: 8px 0;">
            <strong>Name:</strong> {{from_name}}<br/>
            <strong>Email:</strong> {{reply_to}}
          </p>

          <p style="margin: 10px 0 5px;">
            <strong>Message:</strong>
          </p>

          <div
            style="
              background: #f9f9f9;
              padding: 10px;
              border-radius: 5px;
              font-size: 14px;
              white-space: pre-line;
            "
          >
            {{message}}
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 15px; font-size: 12px; color: #888;">
    ⚠️ Reply directly to this email to respond to the sender.
  </div>

</div>

```