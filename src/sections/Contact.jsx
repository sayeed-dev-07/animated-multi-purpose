import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import SectionTitle from "../components/SectionTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RECEIVER_EMAIL = "expsayeedshorif@gmail.com";
const RANDOM_PHONE = "+1 (347) 555-6829";

const CONTACT_INFO = [
    {
        icon: Send,
        text: "4899 Lileo Lane Statesboro\nBoilingbrook - 30458.",
    },
    {
        icon: Mail,
        text: RECEIVER_EMAIL,
        href: `mailto:${RECEIVER_EMAIL}`,
    },
    {
        icon: Phone,
        text: RANDOM_PHONE,
        href: `tel:${RANDOM_PHONE.replace(/\D/g, '')}`,
    },
];

const EMPTY_FORM = {
    name: "",
    email: "",
    message: "",
};

const ContactUs = () => {
    const sectionRef = useRef(null);
    const toastRef = useRef(null); 
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [toast, setToast] = useState({ message: "", type: "" }); 

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    const showToast = (message, type) => {
        setToast({ message, type });

        // Animate Toast In
        gsap.fromTo(toastRef.current,
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }
        );

        // Animate Toast Out after 3 seconds
        setTimeout(() => {
            gsap.to(toastRef.current, {
                y: 50, autoAlpha: 0, duration: 0.5, ease: "power3.in"
            });
        }, 3000);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        // --- EmailJS Implementation ---
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.error("Missing EmailJS environment variables.");
            showToast("Email service is not configured.", "error");
            setIsSubmitting(false);
            return;
        }


        const templateParams = {
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            .then(() => {
                showToast("Message sent successfully!", "success");
                setFormData(EMPTY_FORM);
            })
            .catch((error) => {
                console.error("Email error:", error);
                showToast("Failed to send. Please try again.", "error");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 82%",
            },
        });

        tl.from(".info-item", { y: 28, autoAlpha: 0, stagger: 0.16, ease: "power3.out" })
            .from("input, textarea, button", { y: 24, autoAlpha: 0, stagger: 0.1, ease: "power2.out" }, "-=0.24")
            .from(".footer-text", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.2");

        const icons = gsap.utils.toArray(".icon-wrap");

        gsap.from(icons[0], { x: -92, y: 58, rotate: -32, autoAlpha: 0, duration: 1.2, ease: "back.out(1.9)", scrollTrigger: { trigger: sectionRef.current, start: "top 84%" } });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative pb-20 pt-10 text-white">
            <SectionTitle title="CONTACT US" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />

            <div className="mx-auto mt-14 flex w-full max-w-[760px] flex-col gap-y-12 px-3 sm:px-0">
                <div className="grid grid-cols-1 gap-y-10 text-center sm:grid-cols-3 sm:gap-x-5">
                    {CONTACT_INFO.map((item, i) => (
                        <a href={item.href || "#"} onClick={!item.href ? (e) => e.preventDefault() : undefined} key={i} className="info-item flex flex-col items-center gap-y-2">
                            <div className="icon-wrap inline-flex">
                                <item.icon className="w-[24px] " />
                            </div>
                            <p className="whitespace-pre-line text-[12px] leading-[1.45] text-white/75">{item.text}</p>
                        </a>
                    ))}
                </div>

                <form className="mx-auto flex w-full max-w-[760px] flex-col gap-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input value={formData.name}
                            onChange={handleChange} name="name" required type="text" placeholder="Name" className="contact-input h-8 w-full border border-white/15 bg-white px-2 text-[11px] text-black outline-none" />
                        <input value={formData.email}
                            onChange={handleChange} name="email" required type="email" placeholder="Email" className="contact-input h-8 w-full border border-white/15 bg-white px-2 text-[11px] text-black outline-none" />
                    </div>
                    <textarea value={formData.message}
                        onChange={handleChange} name="message" required placeholder="Message" rows={6} className="w-full resize-none border border-white/15 bg-white px-2 py-1.5 text-[12px] text-black outline-none" />


                    <button disabled={isSubmitting} type="submit" className="mt-2 h-8 w-[120px] bg-white text-[12px] font-medium text-black hover:bg-[#ececec] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? "SENDING..." : "SEND"}
                    </button>
                </form>
            </div>

            <p className="footer-text mt-16 text-center text-[12px] text-white/70">Copyright 2026. Design by MSR</p>

            {/* --- Added Toast Element --- */}
            <div className="pointer-events-none fixed bottom-10 left-0 right-0 z-50 flex justify-center">
                <div
                    ref={toastRef}
                    className={`rounded px-6 py-3 text-[12px] font-medium tracking-wide text-white shadow-lg opacity-0 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
                    style={{ visibility: "hidden" }} // GSAP will manage visibility
                >
                    {toast.message}
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
