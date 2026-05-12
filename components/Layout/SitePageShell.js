/**
 * Shared layout for static/marketing pages: brand-paper canvas + max-width content rail.
 * Use `LegalPageHero` for the white editorial band (PDP-style) above body content.
 */
export function LegalPageHero({ eyebrow, title, titleAccent, subtitle }) {
    return (
        <div className="border-b border-brand-gray-border/80 bg-white">
            <div className="mx-auto max-w-[1550px] px-4 py-8 md:px-8 md:py-10">
                <div className="mx-auto max-w-3xl text-center">
                    {eyebrow ? (
                        <div className="mb-4">{eyebrow}</div>
                    ) : null}
                    <h1 className="text-3xl font-black uppercase leading-tight tracking-[0.06em] text-brand-navy md:text-4xl md:tracking-[0.08em]">
                        {title}
                        {titleAccent ? (
                            <>
                                {" "}
                                <span className="text-brand-yellow-bright">{titleAccent}</span>
                            </>
                        ) : null}
                    </h1>
                    {subtitle ? <p className="mt-3 text-sm leading-relaxed text-brand-muted md:text-base">{subtitle}</p> : null}
                </div>
            </div>
        </div>
    );
}

export default function SitePageShell({ hero = null, children, contentClassName = "" }) {
    return (
        <div className="min-h-screen bg-brand-paper pb-12 md:pb-16">
            {hero}
            <div className={`mx-auto max-w-[1550px] px-4 py-10 md:px-8 md:py-12 ${contentClassName}`}>{children}</div>
        </div>
    );
}
