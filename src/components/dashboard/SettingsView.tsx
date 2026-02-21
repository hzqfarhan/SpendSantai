"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
    User,
    Shield,
    Bell,
    Smartphone,
    LogOut,
    ChevronRight,
    Camera,
    Languages,
    CreditCard,
    Globe,
    X,
    Loader2,
    Sun,
    Moon,
    Upload,
    ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import { updateProfile, changePassword } from "@/actions/user";
import { useThemeStore } from "@/store/useThemeStore";

export const SettingsView = () => {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useThemeStore();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (500KB max)
        if (file.size > 500 * 1024) {
            setMessage({ type: "error", text: "Image must be smaller than 500KB" });
            return;
        }

        // Validate type
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setMessage({ type: "error", text: "Only JPEG, PNG, and WebP images are supported" });
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            setAvatarPreview(evt.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        const formData = new FormData(e.currentTarget);

        const result = await updateProfile({
            name: formData.get("name") as string,
            image: avatarPreview || (session?.user as any)?.image || undefined,
        });

        if (result.success) {
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => {
                setIsProfileModalOpen(false);
                setMessage({ type: "", text: "" });
                setAvatarPreview(null);
                window.location.reload();
            }, 1500);
        } else {
            setMessage({ type: "error", text: result.error || "Failed to update profile." });
        }
        setLoading(false);
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        const formData = new FormData(e.currentTarget);

        const newPass = formData.get("newPassword") as string;
        const confirmPass = formData.get("confirmPassword") as string;

        if (newPass !== confirmPass) {
            setMessage({ type: "error", text: "Password confirmation does not match." });
            setLoading(false);
            return;
        }

        const result = await changePassword({
            oldPassword: formData.get("oldPassword") as string,
            newPassword: newPass,
        });

        if (result.success) {
            setMessage({ type: "success", text: "Password changed successfully!" });
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setMessage({ type: "", text: "" });
            }, 1500);
        } else {
            setMessage({ type: "error", text: result.error || "Failed to change password." });
        }
        setLoading(false);
    };

    const userImage = (session?.user as any)?.image;
    const userName = session?.user?.name || "User";
    const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    const sections = [
        {
            title: "Account",
            items: [
                {
                    icon: User,
                    label: "User Profile",
                    value: session?.user?.name || "User",
                    color: "text-blue-400",
                    onClick: () => setIsProfileModalOpen(true)
                },
                { icon: Globe, label: "Primary Currency", value: "MYR (RM)", color: "text-emerald-400" },
                { icon: Languages, label: "Language", value: "English", color: "text-purple-400" },
            ]
        },
        {
            title: "Appearance",
            items: [
                {
                    icon: theme === "dark" ? Moon : Sun,
                    label: "Theme",
                    value: theme === "dark" ? "Dark Mode" : "Light Mode",
                    color: theme === "dark" ? "text-indigo-400" : "text-amber-400",
                    onClick: toggleTheme,
                    isToggle: true,
                },
            ]
        },
        {
            title: "Security",
            items: [
                {
                    icon: Shield,
                    label: "Change Password",
                    value: "Account Security",
                    color: "text-red-400",
                    onClick: () => setIsPasswordModalOpen(true)
                },
                { icon: Smartphone, label: "2-Factor Authentication", value: "Disabled", color: "text-[var(--color-text-secondary)]" },
            ]
        },
        {
            title: "Preferences",
            items: [
                { icon: Bell, label: "Notifications", value: "Push & Email active", color: "text-amber-400" },
                { icon: CreditCard, label: "Subscription Plan", value: "Free Tier", color: "text-[var(--color-accent-light)]" },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-10">
            {/* Profile Header Card */}
            <GlassCard className="p-6 lg:p-8 glow-accent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-center">
                    <div className="relative group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-[var(--color-border-glass-active)] shadow-xl relative flex items-center justify-center bg-[var(--color-accent)]/20">
                            {userImage ? (
                                <img
                                    src={userImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-black text-[var(--color-accent-light)]">{userInitials}</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="text-center md:text-left z-10">
                        <h2 className="text-2xl lg:text-3xl font-black tracking-tight">{session?.user?.name || "My Account"}</h2>
                        <p className="text-[var(--color-text-secondary)]">{session?.user?.email || "user@example.com"}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full uppercase">Basic Member</span>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase">Verified Account</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Settings Sections */}
            <div className="space-y-6 lg:space-y-8">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-3 lg:space-y-4">
                        <h3 className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em] ml-2">{section.title}</h3>
                        <GlassCard className="overflow-hidden">
                            <div className="divide-y divide-[var(--color-border-glass)]">
                                {section.items.map((item: any) => (
                                    <button
                                        key={item.label}
                                        onClick={item.onClick}
                                        className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-[var(--color-bg-glass-hover)] transition-all group min-h-[56px]"
                                    >
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-[var(--color-bg-glass)] border border-[var(--color-border-glass)] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold">{item.label}</p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">{item.value}</p>
                                            </div>
                                        </div>
                                        {item.isToggle ? (
                                            <div className={`w-12 h-7 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-[var(--color-accent)]" : "bg-[var(--color-border-glass-active)]"}`}>
                                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
                                            </div>
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                ))}
            </div>

            {/* Sign Out */}
            <div className="pt-4 lg:pt-6">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 p-4 lg:p-5 bg-red-500/10 text-red-400 rounded-2xl lg:rounded-3xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all min-h-[56px]"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>

            {/* Edit Profile Modal with Image Upload */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
                        <GlassCard className="p-6 lg:p-8 glow-accent">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Edit Profile</h3>
                                <button onClick={() => { setIsProfileModalOpen(false); setAvatarPreview(null); setMessage({ type: "", text: "" }); }} className="p-2 hover:bg-[var(--color-bg-glass-hover)] rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                {/* Profile Picture Upload */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-border-glass-active)] flex items-center justify-center bg-[var(--color-accent)]/20">
                                            {(avatarPreview || userImage) ? (
                                                <img
                                                    src={avatarPreview || userImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl font-black text-[var(--color-accent-light)]">{userInitials}</span>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs text-[var(--color-accent-light)] font-semibold hover:underline flex items-center gap-1"
                                    >
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        Upload Photo
                                    </button>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">JPEG, PNG, or WebP • Max 500KB</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">Full Name</label>
                                    <input name="name" defaultValue={session?.user?.name || ""} required className="glass-input" />
                                </div>

                                {message.text && (
                                    <div className={`p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <button disabled={loading} type="submit" className="w-full btn-primary !py-4 disabled:opacity-50 flex justify-center items-center">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                </button>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
                        <GlassCard className="p-6 lg:p-8 glow-accent">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Change Password</h3>
                                <button onClick={() => { setIsPasswordModalOpen(false); setMessage({ type: "", text: "" }); }} className="p-2 hover:bg-[var(--color-bg-glass-hover)] rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">Current Password</label>
                                    <input name="oldPassword" type="password" required className="glass-input" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">New Password</label>
                                    <input name="newPassword" type="password" required className="glass-input" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">Confirm New Password</label>
                                    <input name="confirmPassword" type="password" required className="glass-input" />
                                </div>
                                {message.text && (
                                    <div className={`p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <button disabled={loading} type="submit" className="w-full btn-primary !py-4 disabled:opacity-50 flex justify-center items-center">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Change Password"}
                                </button>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
