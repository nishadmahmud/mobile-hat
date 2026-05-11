import { getBlogs } from '../../../lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';

export default async function BlogDetailPage({ params }) {
    const { id } = await params;

    let blog = null;
    try {
        const res = await getBlogs();
        if (res?.success && res.data) {
            blog = res.data.find(post => post.id.toString() === id.toString());
        }
    } catch (error) {
        console.error("Error fetching blog from list:", error);
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                <Link href="/blogs" className="text-blue-600 font-bold flex items-center gap-2">
                    <FiArrowLeft /> Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                    <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium mb-6">
                        <FiArrowLeft /> Back to Blogs
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                        {blog.created_at && (
                            <div className="flex items-center gap-2">
                                <FiCalendar className="text-blue-600" />
                                {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <FiUser className="text-blue-600" />
                            By Admin
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-[1550px] mx-auto px-4 md:px-8 mt-10">
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                    {/* Hero Image */}
                    {blog.image && (
                        <div className="aspect-[21/9] relative bg-gray-100">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                            />
                        </div>
                    )}

                    {/* Blog Body */}
                    <div className="p-6 md:p-12 lg:p-16">
                        <div
                            className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-headings:font-black prose-img:rounded-2xl break-words overflow-x-hidden w-full"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
