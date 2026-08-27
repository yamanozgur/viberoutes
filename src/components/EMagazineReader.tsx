import React, { useState } from 'react';
import { EMagazineIssue, MagazinePage } from '../types';
import { MAGAZINE_ISSUES } from '../data/magazineIssues';
import { Download, ChevronLeft, ChevronRight, BookOpen, Check, Lock, Sparkles, Share2 } from 'lucide-react';

interface EMagazineReaderProps {
  onBackToArticles: () => void;
}

export const EMagazineReader: React.FC<EMagazineReaderProps> = ({ onBackToArticles }) => {
  const [selectedIssue, setSelectedIssue] = useState<EMagazineIssue>(MAGAZINE_ISSUES[0]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentPage: MagazinePage = selectedIssue.previewPages[currentPageIndex] || selectedIssue.previewPages[0];

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setDownloadSuccess(true);
      // simulate pdf download initiation
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `VibeRoutes_Issue_${selectedIssue.issueNumber}.pdf`);
      document.body.appendChild(link);
      setTimeout(() => {
        alert(`Thank you for subscribing! Vibe Routes Issue 0${selectedIssue.issueNumber} (PDF, ${selectedIssue.downloadSize}) has been queued to ${email}.`);
      }, 400);
    }
  };

  return (
    <div className="bg-[#FAFAF7] min-h-screen pb-20 text-[#2D2924]">
      {/* Editorial Header */}
      <div className="border-b border-[#E5E0D8] bg-[#F7F5F0] py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[11px] font-ui uppercase tracking-[0.3em] text-[#767064] block font-medium">
              Vibe Routes Publications · Adobe InDesign Series
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-[#1A1814] tracking-tight">
              The Monthly Digital Edition
            </h1>
            <p className="font-display text-lg italic text-[#9E7B54] font-light max-w-2xl">
              A 25–30 page curated PDF magazine delivered monthly to subscribers. High-production cartography, boutique stay dossiers, and slow travel essays.
            </p>
          </div>

          {/* Issue Selector Tabs */}
          <div className="flex items-center space-x-2 bg-[#FFFFFF] p-1 border border-[#E5E0D8] shadow-xs">
            {MAGAZINE_ISSUES.map((issue) => (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  setCurrentPageIndex(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-ui transition-all cursor-pointer ${
                  selectedIssue.id === issue.id
                    ? 'bg-[#1A1814] text-[#FAFAF7] font-medium'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                Issue 0{issue.issueNumber} ({issue.monthYear.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10">
        {/* Issue Overview & Interactive Reader Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Flip / Page Preview */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5E0D8] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3 mb-6 text-xs font-ui text-[#767064]">
              <span className="uppercase tracking-widest text-[#1A1814] font-medium">
                Issue 0{selectedIssue.issueNumber}: {selectedIssue.title}
              </span>
              <span>
                Page {currentPage.pageNumber} of {selectedIssue.pageCount}
              </span>
            </div>

            {/* InDesign Simulated Page Frame */}
            <div className="bg-[#FAFAF7] border border-[#E5E0D8] p-6 sm:p-10 min-h-[480px] flex flex-col justify-between relative shadow-xs">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase font-ui tracking-[0.2em] text-[#767064] border-b border-[#E5E0D8] pb-2">
                  <span>{currentPage.category}</span>
                  <span>VIBE ROUTES MAGAZINE</span>
                </div>

                <div className="aspect-[16/10] overflow-hidden bg-[#EBE5DC] border border-[#E5E0D8]">
                  <img
                    src={currentPage.imageUrl}
                    alt={currentPage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814] leading-tight">
                  {currentPage.title}
                </h3>
                <p className="font-display text-base italic text-[#9E7B54] font-light">
                  {currentPage.subtitle}
                </p>

                <p className="font-ui text-sm text-[#4A453E] font-light leading-[1.8]">
                  {currentPage.bodyPreview}
                </p>

                {currentPage.quote && (
                  <div className="p-3 bg-[#FFFFFF] border-l-2 border-[#9E7B54] text-xs font-display italic text-[#1A1814]">
                    "{currentPage.quote}"
                  </div>
                )}
              </div>

              {/* Reader Navigation Controls */}
              <div className="pt-6 border-t border-[#E5E0D8] flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentPageIndex === 0}
                  className="flex items-center space-x-1 text-xs font-ui text-[#1A1814] disabled:opacity-30 hover:text-[#9E7B54] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Page</span>
                </button>

                <div className="flex space-x-1.5">
                  {selectedIssue.previewPages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        currentPageIndex === idx ? 'bg-[#1A1814] w-4' : 'bg-[#D8D2C7]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPageIndex((prev) =>
                      Math.min(selectedIssue.previewPages.length - 1, prev + 1)
                    )
                  }
                  disabled={currentPageIndex === selectedIssue.previewPages.length - 1}
                  className="flex items-center space-x-1 text-xs font-ui text-[#1A1814] disabled:opacity-30 hover:text-[#9E7B54] cursor-pointer"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Download & Table of Contents */}
          <div className="lg:col-span-5 space-y-6">
            {/* Download / Subscribe Card */}
            <div className="border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-ui uppercase tracking-widest text-[#1A1814] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#9E7B54]" />
                <span>Full Issue Access ({selectedIssue.pageCount} Pages)</span>
              </div>

              <h3 className="font-display text-2xl font-light text-[#1A1814]">
                Download High-Resolution PDF
              </h3>

              <p className="text-xs font-ui text-[#4A453E] font-light leading-relaxed">
                {selectedIssue.description}
              </p>

              <div className="text-[11px] font-ui text-[#767064] space-y-1 py-1">
                <div>Format: Interactive 300 DPI PDF with embedded links</div>
                <div>File Size: {selectedIssue.downloadSize}</div>
                <div>Editor: {selectedIssue.editorName}</div>
              </div>

              {downloadSuccess ? (
                <div className="p-4 bg-[#FAFAF7] border border-[#9E7B54] text-xs font-ui text-[#1A1814] space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#9E7B54]">
                    <Check className="w-4 h-4" /> Download Link Dispatched
                  </div>
                  <p className="text-[11px] text-[#767064]">
                    We have sent the PDF download link for Issue 0{selectedIssue.issueNumber} to {email}. Check your inbox or download directly below.
                  </p>
                  <button
                    onClick={() => alert(`Starting download: VibeRoutes_Issue_0${selectedIssue.issueNumber}.pdf`)}
                    className="w-full mt-2 py-2.5 bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Direct PDF Download
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDownload} className="space-y-3 pt-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-[#D8D2C7] px-4 py-3 text-xs font-ui text-[#1A1814] placeholder-[#767064] focus:outline-none focus:border-[#9E7B54]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] py-3 text-xs uppercase tracking-widest font-ui font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get Free Instant PDF</span>
                  </button>
                </form>
              )}
            </div>

            {/* Table of Contents */}
            <div className="border border-[#E5E0D8] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
              <h4 className="font-display text-xl font-light text-[#1A1814] border-b border-[#E5E0D8] pb-2">
                Table of Contents — Issue 0{selectedIssue.issueNumber}
              </h4>
              <div className="space-y-3 text-xs font-ui">
                {selectedIssue.tableOfContents.map((toc, idx) => (
                  <div key={idx} className="flex justify-between items-baseline border-b border-[#E5E0D8] pb-2">
                    <div>
                      <span className="font-medium text-[#1A1814] block">{toc.section}</span>
                      <span className="text-[#767064] text-[11px] font-light">{toc.description}</span>
                    </div>
                    <span className="font-display text-sm text-[#9E7B54] font-medium shrink-0 ml-4">
                      p. {toc.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
