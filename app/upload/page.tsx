"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/ui/Navbar";
import { PageTransition, FadeIn } from "@/components/ui/PageTransition";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function UploadPage() {
  const router = useRouter();
  const { setDataset } = useStore();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<{
    totalAttractions: number;
    totalRoutes: number;
    categories: string[];
  } | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.name.endsWith(".txt")) {
        setError("Please upload a .txt file");
        setUploadState("error");
        return;
      }

      setFileName(file.name);
      setFileSize(file.size);
      setUploadState("uploading");
      setError("");

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setProgress(100);
        setDataset(data.dataset);
        setSummary(data.summary);
        setUploadState("success");
      } catch (err) {
        clearInterval(progressInterval);
        setError(err instanceof Error ? err.message : "Upload failed");
        setUploadState("error");
        setProgress(0);
      }
    },
    [setDataset]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    maxFiles: 1,
    disabled: uploadState === "uploading",
  });

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 pb-20">
          <PageTransition>
            <div className="w-full max-w-2xl">
              {/* Title */}
              <FadeIn className="text-center mb-10 sm:mb-14">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4">
                  Upload Your Dataset
                </h1>
                <p
                  className="text-white/60 text-sm sm:text-base max-w-md mx-auto"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Drag and drop your attractions .txt file to begin planning
                  your perfect trip.
                </p>
              </FadeIn>

              {/* Upload Zone */}
              <FadeIn delay={0.2}>
                <div
                  {...getRootProps()}
                  className={`liquid-glass rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-500 ${
                    isDragActive
                      ? "scale-[1.02] shadow-lg shadow-white/5"
                      : "hover:scale-[1.01]"
                  } ${uploadState === "error" ? "border border-red-500/20" : ""}`}
                >
                  <input {...getInputProps()} />

                  <AnimatePresence mode="wait">
                    {uploadState === "idle" && (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-5"
                      >
                        <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center animate-float">
                          <Upload size={28} className="text-white/70" />
                        </div>
                        <div>
                          <p className="text-white text-lg mb-2">
                            Drop your file here
                          </p>
                          <p
                            className="text-white/40 text-sm"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                          >
                            or click to browse • .txt files only
                          </p>
                        </div>
                        <button
                          className="bg-white text-black text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-white/90"
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          Browse Files
                        </button>
                      </motion.div>
                    )}

                    {uploadState === "uploading" && (
                      <motion.div
                        key="uploading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-5"
                      >
                        <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center">
                          <FileText size={28} className="text-white/70 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-white text-lg mb-1">{fileName}</p>
                          <p
                            className="text-white/40 text-sm"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                          >
                            Parsing dataset...
                          </p>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </div>
                        <p
                          className="text-white/50 text-xs"
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          {Math.round(progress)}%
                        </p>
                      </motion.div>
                    )}

                    {uploadState === "success" && summary && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-5"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center"
                        >
                          <CheckCircle2 size={32} className="text-emerald-400" />
                        </motion.div>
                        <div>
                          <p className="text-white text-lg mb-1">
                            Dataset Uploaded
                          </p>
                          <p
                            className="text-white/40 text-sm"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                          >
                            {fileName} •{" "}
                            {fileSize > 1024
                              ? `${(fileSize / 1024).toFixed(1)} KB`
                              : `${fileSize} B`}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-2">
                          <div className="text-center">
                            <p className="text-2xl text-white">
                              {summary.totalAttractions}
                            </p>
                            <p
                              className="text-white/40 text-xs mt-1"
                              style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                              Attractions
                            </p>
                          </div>
                          <div className="w-px bg-white/10" />
                          <div className="text-center">
                            <p className="text-2xl text-white">
                              {summary.totalRoutes}
                            </p>
                            <p
                              className="text-white/40 text-xs mt-1"
                              style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                              Routes
                            </p>
                          </div>
                          <div className="w-px bg-white/10" />
                          <div className="text-center">
                            <p className="text-2xl text-white">
                              {summary.categories.length}
                            </p>
                            <p
                              className="text-white/40 text-xs mt-1"
                              style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                              Categories
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {uploadState === "error" && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-5"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                          <AlertCircle size={32} className="text-red-400" />
                        </div>
                        <div>
                          <p className="text-white text-lg mb-1">
                            Upload Failed
                          </p>
                          <p
                            className="text-red-400/80 text-sm"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                          >
                            {error}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadState("idle");
                            setProgress(0);
                            setError("");
                          }}
                          className="bg-white text-black text-sm font-medium px-6 py-2.5 rounded-full"
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          Try Again
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>

              {/* Continue Button */}
              {uploadState === "success" && (
                <FadeIn delay={0.3} className="mt-8 flex justify-center">
                  <button
                    onClick={() => router.push("/preferences")}
                    className="group bg-white text-black font-medium px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-300 hover:gap-4 hover:shadow-lg hover:shadow-white/10"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    <Sparkles size={18} />
                    Continue to Preferences
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </FadeIn>
              )}

              {/* Sample Dataset Link */}
              {uploadState === "idle" && (
                <FadeIn delay={0.4} className="mt-8 text-center">
                  <p
                    className="text-white/30 text-xs"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    Don&apos;t have a dataset?{" "}
                    <a
                      href="/dataset/sample.txt"
                      download
                      className="text-white/50 underline hover:text-white/70 transition-colors"
                    >
                      Download sample
                    </a>
                  </p>
                </FadeIn>
              )}
            </div>
          </PageTransition>
        </div>
      </div>
    </section>
  );
}
