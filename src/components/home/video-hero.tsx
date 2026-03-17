"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type VideoHeroProps = {
    title: string;
    thumbnail: string;
    videoUrl: string;
    className?: string;
};

export default function VideoHero({
    title,
    thumbnail,
    videoUrl,
    className,
}: VideoHeroProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <section className={cn("w-full", className)}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {title}
                </h2>
            </div>

            {/* ✅ 30% height banner (short) */}
            <div className="mt-5 w-full">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={cn(
                        "group relative block w-full overflow-hidden",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                    aria-label={`Play ${title} video`}
                >
                    <div
                        className={cn(
                            "relative w-full bg-muted",
                            // shorter than before (~30%)
                            "h-[220px] sm:h-[260px] lg:h-[300px]"
                        )}
                    >
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority={false}
                        />

                        <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/45" />

                        <div className="absolute inset-0 grid place-items-center">
                            <span className="relative grid place-items-center">
                                {/* ripple animation */}
                                <span
                                    className="absolute inset-0 rounded-full bg-background/60"
                                    style={{
                                        animation: "play-pulse 2.2s ease-out infinite",
                                    }}
                                />

                                <span
                                    className={cn(
                                        "relative z-10 grid place-items-center rounded-full",
                                        "h-12 w-12 sm:h-14 sm:w-14",
                                        "bg-background/80 backdrop-blur-md border",
                                        "text-foreground shadow-lg",
                                        "transition-transform duration-300",
                                        "group-hover:scale-110"
                                    )}
                                >
                                    <Play className="h-5 w-5 translate-x-[1px]" />
                                </span>
                            </span>

                        </div>
                    </div>
                </button>
            </div>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                    <DialogTitle className="sr-only">{title}</DialogTitle>

                    <div className="relative aspect-video w-full bg-black">
                        <iframe
                            className="absolute inset-0 h-full w-full"
                            src={normalizeToEmbed(videoUrl)}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 p-3">
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}

function normalizeToEmbed(url: string) {
    try {
        if (url.includes("youtube.com/watch")) {
            const u = new URL(url);
            const id = u.searchParams.get("v");
            if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
        }
        if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1]?.split("?")[0];
            if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
        }
        if (url.includes("youtube.com/embed"))
            return url.includes("autoplay=1") ? url : `${url}?autoplay=1`;
        if (url.includes("player.vimeo.com"))
            return url.includes("autoplay=1") ? url : `${url}?autoplay=1`;
        return url;
    } catch {
        return url;
    }
}
