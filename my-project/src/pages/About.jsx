import { Eye, Users, ShieldCheck, Target, CheckCircle } from 'lucide-react';

export default function About() {
    const features = [
        {
            icon: Eye,
            title: "Transparency",
            desc: "Making infrastructure project progress visible to every citizen, ensuring accountability in public spending. Citizens feel heard and involved while Authorities gain actionable insights."
        },
        {
            icon: Users,
            title: "Participation",
            desc: "Empowering citizens to actively contribute feedback and help shape their communities. We believe that meaningful change begins when citizens are actively involved."
        },
        {
            icon: ShieldCheck,
            title: "Accountability",
            desc: "Holding authorities responsible through public sentiment tracking and issue reporting. All feedback, ratings, and reported issues on the platform are publicly visible, ensuring that project authorities remain answerable to the communities they serve."
        },
        {
            icon: Target,
            title: "Impact",
            desc: "Driving real improvements in infrastructure delivery through collective citizen voice. By analyzing public feedback and issue trends, the platform helps identify critical problems and improvement areas across infrastructure projects."
        }
    ];

    const stats = [
        { label: "States Covered", value: "8" },
        { label: "Projects Tracked", value: "12" },
        { label: "Active Citizens", value: "16" },
        { label: "Issue Resolution", value: "57%" },
    ];

    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 mb-6 py-2">
                        Building Trust Through Transparency
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-6">
                        PublicPulse is a citizen-focused platform designed to bridge the gap between infrastructure authorities and the communities they serve. We believe that public projects should be accountable to the public.
                    </p>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Public infrastructure projects shape the daily lives of millions, yet citizens often lack clear, reliable information about their progress, quality, and impact. Our Public Feedback System for Infrastructure is designed to bridge this gap by promoting transparency, accountability, and citizen participation. This platform empowers citizens to share feedback, report issues, and express concerns related to public infrastructure projects such as roads, railways, and utilities. By making public feedback visible and accessible, the system encourages responsible governance and data-driven decision-making.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-blue-50 rounded-3xl p-8 md:p-12 mb-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                            <p>
                                To create a transparent, accessible, and effective feedback mechanism that empowers citizens to participate in infrastructure development, ensures accountability from implementing authorities, and ultimately leads to better public services.
                            </p>
                            <p>
                                To build trust between citizens and authorities by providing an open, transparent, and secure platform where public voices are heard and infrastructure progress is openly evaluated.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col md:flex-row p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <feature.icon size={28} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-16">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">{stat.value}</div>
                            <div className="text-gray-500 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
