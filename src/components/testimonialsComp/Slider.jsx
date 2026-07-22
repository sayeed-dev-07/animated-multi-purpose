import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable } from "gsap/all"
import InertiaPlugin from "gsap/InertiaPlugin"


import { ChevronLeft, ChevronRight } from "lucide-react"
import MorphingLoader from "../Loading"
gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP)

const MOBILE_BREAKPOINT = 768
const DESKTOP_INTERACTION_SLIDE_DURATION = 1
const MOBILE_INTERACTION_SLIDE_DURATION = 0.85

const getMotionConfig = (viewportWidth) => {
  const isSmallScreen = viewportWidth < MOBILE_BREAKPOINT

  return {
    interactionSlideDuration: isSmallScreen
      ? MOBILE_INTERACTION_SLIDE_DURATION
      : DESKTOP_INTERACTION_SLIDE_DURATION,
  }
}

const Slider = () => {
  const container = useRef(null)
  const track = useRef(null)
  const draggableRef = useRef(null)
  const trackTweenRef = useRef(null)
  const centerCardRef = useRef(() => { })

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getData = async () => {
    try {
      const res = await fetch('https://backend-updated-topaz.vercel.app/testimonials')
      if (!res.ok) {
        throw new Error('Failed to fetch testimonials')
      }

      const resData = await res.json()
      const testimonials = Array.isArray(resData?.[0]?.testimonials) ? resData[0].testimonials : []

      setData(testimonials)
      setError(null)
    } catch (fetchError) {
      console.error('Testimonials fetch error:', fetchError)
      setData([])
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    getData()
  }, [])




  const initialIndex = Math.floor(data.length / 2)
  const indexRef = useRef(initialIndex)

  useGSAP(() => {
    gsap.config({ force3D: true });
    const cards = gsap.utils.toArray(".main-card");
    const trackEl = track.current;

    // 1. Allow logic to run if there is at least 1 card
    if (!trackEl || cards.length === 0) return;

    let cardWidth = 0;
    let spacing = 0;
    let viewportCenter = 0;
    let minX = 0;
    let maxX = 0;

    let motion = getMotionConfig(window.innerWidth);
    let resizeFrame = 0;

    function calculateLayout() {
      const parentWidth = container.current?.parentElement?.clientWidth;
      const containerWidth = parentWidth ?? container.current?.clientWidth ?? 0;
      if (!containerWidth) return;

      cardWidth = cards[0].offsetWidth;

      // 2. Safe spacing calculation
      spacing = cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : 0;

      viewportCenter = containerWidth / 2;

      // Calculation works for 1 card: minX and maxX will be the same
      minX = viewportCenter - ((cards.length - 1) * spacing + cardWidth / 2);
      maxX = viewportCenter - cardWidth / 2;
    }

    function centerCard(index, animate = true) {
      indexRef.current = index;
      const x = viewportCenter - (index * spacing + cardWidth / 2);

      if (!animate) {
        trackTweenRef.current?.kill();
        trackTweenRef.current = null;
        gsap.set(trackEl, { x });
        return;
      }

      trackTweenRef.current?.kill();
      trackTweenRef.current = gsap.to(trackEl, {
        x,
        duration: motion.interactionSlideDuration,
        ease: "power3.out",
        onComplete: () => {
          trackTweenRef.current = null;
        }
      });
    }

    centerCardRef.current = centerCard;
    calculateLayout();

    // Initial positioning
    const startX = viewportCenter - (indexRef.current * spacing + cardWidth / 2);
    gsap.set(trackEl, { x: startX });

    if (draggableRef.current) draggableRef.current.kill();

    // 3. Only enable Draggable if there's more than 1 card
    if (cards.length > 1) {
      draggableRef.current = Draggable.create(trackEl, {
        type: "x",
        inertia: true,
        edgeResistance: 0.9,
        dragResistance: 0.1,
        bounds: { minX, maxX },
        snap: () => {
          const velocity = InertiaPlugin.getVelocity(trackEl, "x");
          let move = 1;
          if (Math.abs(velocity) > 20000) move = 3;
          else if (Math.abs(velocity) > 10000) move = 2;

          const direction = velocity < 0 ? 1 : -1;
          let next = indexRef.current + move * direction;
          next = Math.max(0, Math.min(cards.length - 1, next));

          centerCard(next, true);
          return viewportCenter - (next * spacing + cardWidth / 2);
        }
      })[0];
    }

    function handleResize() {
      motion = getMotionConfig(window.innerWidth);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        calculateLayout();
        centerCard(indexRef.current, false);
        draggableRef.current?.applyBounds({ minX, maxX });
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      trackTweenRef.current?.kill();
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      draggableRef.current?.kill();
    };
  }, { scope: container, dependencies: [data] }); // Added data dependency

  const slideBy = (step) => {
    if (!data.length) return

    const total = data.length
    const next = ((indexRef.current + step) % total + total) % total
    centerCardRef.current(next, true)
  }


  // getting data 


  if (loading) {
    return <MorphingLoader />
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 font-bold uppercase text-xs tracking-tighter">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div ref={container} className="relative z-10 w-full px-3 pb-8 pt-10 sm:px-6 sm:pt-12 lg:px-0">
      <div
        ref={track}
        className="flex gap-5  will-change-transform sm:gap-7 md:gap-8"
      >
        {data.map((item, index) => (
          <article
            key={item.id || item._id || index}
            className="main-card flex w-[290px] sm:w-[320px] md:w-[340px] flex-shrink-0 flex-col justify-between rounded-2xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          >
            <div>

              <div className="mb-5 text-gray-200">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>


              <p className=" text-[12px] leading-relaxed text-gray-600">
                {item.testimonial}
              </p>
            </div>

            {/* Refined User Block */}
            <div className="mt-8 flex items-center gap-4 border-t border-gray-50 pt-5">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-white">
                <img
                  src={item.imgLink}
                  alt={item.name || "Client"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold tracking-tight text-gray-900">
                  {item.name}
                </h3>
                {/* Position is smaller, uppercase, and tracked out for an elegant look */}
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  {item.position}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-9 flex items-center justify-center gap-5 sm:mt-11">
        <button
          type="button"
          onClick={() => slideBy(-1)}
          aria-label="Previous testimonial"
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#d4b249] transition-transform duration-200 hover:scale-105 cursor-pointer active:scale-95"
        >
          <ChevronLeft />
        </button>

        <div className="h-9 w-[1px] bg-white/85" />

        <button
          type="button"
          onClick={() => slideBy(1)}
          aria-label="Next testimonial"
          className="group cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f0f0] transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronRight />

        </button>
      </div>
    </div>
  )
}

export default Slider
