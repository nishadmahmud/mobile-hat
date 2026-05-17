from pathlib import Path

path = Path(__file__).resolve().parents[1] / "components" / "Header" / "Header.js"
text = path.read_text(encoding="utf-8")

start = text.find("                    {hoverCategoryIndex === idx && (")
end = text.find("                ))}", start) + len("                ))}")
if start == -1:
    raise SystemExit("start not found")

new = """                    {hoverCategoryIndex === idx && !allMenuCategory && (
                      <div
                        className={`flyout-submenu absolute top-full z-[60] w-[min(220px,calc(100vw-2rem))] pt-1.5 ${alignEnd ? 'right-0' : 'left-0'}`}
                        onMouseEnter={() => openMegaMenu(idx)}
                      >
                        <motion.div
                          className="overflow-hidden rounded-lg border border-slate-200/90 bg-white text-slate-800 shadow-[0_12px_36px_rgba(15,23,42,0.12)]"
                        >
                          <motion.div
                            className="border-b border-slate-100 bg-slate-50/80 px-3 py-2"
                          >
                            <p className="text-[12px] font-semibold text-slate-900">{cat.name || cat.category_name}</p>
                            <p className="text-[10px] text-slate-500">Subcategories</p>
                          </motion.div>

                          {subcategories.length > 0 ? (
                            <ul className="max-h-[min(240px,40vh)] overflow-y-auto py-0.5">
                              {subcategories.map((subcat) => (
                                <li key={subcat.id || subcat.name}>
                                  <Link
                                    href={`/category/${catSlug}?subcategory_id=${subcat.id}`}
                                    className="group flex items-center justify-between gap-2 px-3 py-2 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                  >
                                    <span className="truncate text-left leading-snug">{subcat.name}</span>
                                    <FiChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500" aria-hidden />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <motion.div
                              className="px-3 py-4 text-center"
                            >
                              <p className="text-[12px] text-slate-500">No subcategories</p>
                              <Link
                                href={`/category/${catSlug}`}
                                className="mt-2 inline-block text-[12px] font-medium text-slate-900 underline-offset-4 hover:underline"
                              >
                                Browse category
                              </Link>
                            </motion.div>
                          )}

                          <motion.div
                            className="border-t border-slate-100 bg-slate-50/80 px-3 py-2"
                          >
                            <Link
                              href={`/category/${catSlug}`}
                              className="text-[11px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
                            >
                              View all in this category
                            </Link>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                  );
                })}"""

new = new.replace("motion.div", "div")

text = text[:start] + new + text[end:]
path.write_text(text, encoding="utf-8")
print("patched", end - start, "chars")
