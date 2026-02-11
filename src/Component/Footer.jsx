import React from 'react';
import { Github, Linkedin, Mail, Shield, Zap, Database } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-slate-100 mt-20">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">EventTrack</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            A high-performance event tracking system designed for real-time analytics and user behavior insights.
                        </p>
                    </div>

                    {/* Architecture Details */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            Architecture
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Built using the <strong>Producer-Consumer pattern</strong> with Bull queues to ensure non-blocking user interactions.
                        </p>
                    </div>

                    {/* Stack Details */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Database className="w-4 h-4 text-emerald-500" />
                            Tech Stack
                        </h3>
                        <ul className="text-xs text-slate-500 space-y-2">
                            <li>React & Tailwind CSS</li>
                            <li>Node.js (Express)</li>
                            <li>MongoDB Atlas</li>
                            <li>Better Queue (Async)</li>
                        </ul>
                    </div>

                    {/* Social / Contact */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" />
                            Connect
                        </h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="mailto:jobs@qressy.com" className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all duration-300">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                        Technical Assessment &bull; Qressy Jobs &bull; 2026
                    </p>
                    <div className="flex gap-6 text-[11px] font-medium text-slate-400">
                        <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-wider">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-wider">Documentation</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
