import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, PanelBottom, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { api } from "../../api/axios";
import { HistoryHeader } from "../../components/HistoryBits/HistoryBits";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import SitePreview from "../../components/SitePreview/SitePreview";
import { LangRow } from "./bits";
import { imageUrl, useUpload } from "./helpers";

const ENDPOINT = "/api/site-settings/admin/client-footer";
const EMPTY = { bn: "", en: "" };

const TITLES = [
  ["license", "Gaming license"],
  ["responsible", "Responsible gaming"],
  ["payment", "Payment method"],
  ["certification", "Certification"],
  ["security", "Security"],
  ["help", "Help (desktop)"],
  ["products", "Products (desktop)"],
  ["social", "Social media (desktop)"],
];

/** মোবাইল ফুটারের ছবির সারি — ক্লায়েন্টের Footer.jsx এর ক্রমে */
const IMAGE_ROWS = [
  ["license", "Gaming license", "Under the licence heading."],
  ["responsible", "Responsible gaming", "Next to the licence."],
  ["providers", "Game providers", "The wide providers image."],
  ["payment", "Payment methods", "Under the payment heading."],
  ["certification", "Certification", "Tick “new line” to start a second row."],
  ["security", "Security", "Under the security heading."],
];

const pick = (d = {}) => ({
  titles: Object.fromEntries(TITLES.map(([k]) => [k, d.titles?.[k] || { ...EMPTY }])),
  licenseText: d.licenseText || { ...EMPTY },
  copyright: d.copyright || { ...EMPTY },
  ...Object.fromEntries(IMAGE_ROWS.map(([k]) => [k, d[k] || []])),
  desktopProviders: d.desktopProviders || [],
  socials: d.socials || [],
});

/** ছোট ছবির ঘর — ক্লিক করলে আপলোড */
const Thumb = ({ value, onChange, size = "h-12 w-16" }) => {
  const upload = useUpload();
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const choose = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const url = await upload(file);
      if (url) onChange(url);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        title={value ? "Change image" : "Choose image"}
        className={`flex ${size} shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border border-white/[0.08] bg-black/30 transition hover:border-[var(--primary500)]`}
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" />
        ) : value ? (
          <img src={imageUrl(value)} alt="" className="h-full w-full object-contain" />
        ) : (
          <ImagePlus size={16} className="text-[var(--text-disabled)]" />
        )}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={choose} />
    </>
  );
};

/** সারির ক্রম বদল ও মোছা */
const RowTools = ({ index, count, onMove, onRemove }) => (
  <div className="ms-auto flex shrink-0 items-center gap-1">
    <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} className="ad-btn ad-btn--ghost ad-btn--sm" title="Move up">
      <ArrowUp size={13} />
    </button>
    <button type="button" onClick={() => onMove(index, 1)} disabled={index === count - 1} className="ad-btn ad-btn--ghost ad-btn--sm" title="Move down">
      <ArrowDown size={13} />
    </button>
    <button type="button" onClick={() => onRemove(index)} className="ad-btn ad-btn--danger ad-btn--sm" title="Remove">
      <Trash2 size={13} />
    </button>
  </div>
);

/** তালিকা সম্পাদনার সাধারণ কাজ — বদল, সরানো, মোছা, যোগ */
const useList = (list, onChange) => ({
  update: (i, patch) => onChange(list.map((row, j) => (j === i ? { ...row, ...patch } : row))),
  move: (i, dir) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  },
  remove: (i) => onChange(list.filter((_, j) => j !== i)),
  add: (row) => onChange([...list, row]),
});

const num = "ad-input !h-9 !w-[74px] !px-2 text-center";

/** মোবাইলের একটা ছবির সারি */
const ImageList = ({ title, hint, list, onChange }) => {
  const L = useList(list, onChange);
  return (
    <div className="rounded-[14px] border border-white/[0.07] p-3">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-[13px] font-extrabold text-[var(--neutral100)]">{title}</p>
        <span className="text-[11px] text-[var(--text-muted)]">{hint}</span>
      </div>
      <div className="flex flex-col gap-2">
        {list.map((row, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-[10px] bg-black/20 p-2">
            <Thumb value={row.image} onChange={(v) => L.update(i, { image: v })} />
            <label className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              W <input type="number" min="0" value={row.w ?? 0} onChange={(e) => L.update(i, { w: Number(e.target.value) })} className={num} />
            </label>
            <label className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              H <input type="number" min="0" value={row.h ?? 0} onChange={(e) => L.update(i, { h: Number(e.target.value) })} className={num} />
            </label>
            <input value={row.link || ""} onChange={(e) => L.update(i, { link: e.target.value })} placeholder="Link (optional) https://…" className="ad-input !h-9 min-w-[160px] flex-1" />
            {i > 0 ? (
              <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                <input type="checkbox" checked={Boolean(row.br)} onChange={(e) => L.update(i, { br: e.target.checked })} /> New line
              </label>
            ) : null}
            <RowTools index={i} count={list.length} onMove={L.move} onRemove={L.remove} />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => L.add({ image: "", w: 60, h: 40, link: "", br: false })} className="ad-btn ad-btn--ghost ad-btn--sm mt-2">
        <Plus size={13} /> Add image
      </button>
    </div>
  );
};

/** ডেস্কটপের প্রোভাইডার লোগো / সোশ্যাল লিংক — ছবি + নাম + লিংক */
const NamedList = ({ list, onChange, imageKey, linkKey, namePh, linkPh, addLabel }) => {
  const L = useList(list, onChange);
  return (
    <div>
      <div className="flex flex-col gap-2">
        {list.map((row, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-[10px] bg-black/20 p-2">
            <Thumb value={row[imageKey]} onChange={(v) => L.update(i, { [imageKey]: v })} size="h-10 w-14" />
            <input value={row.name || ""} onChange={(e) => L.update(i, { name: e.target.value })} placeholder={namePh} className="ad-input !h-9 !w-[140px]" />
            <input value={row[linkKey] || ""} onChange={(e) => L.update(i, { [linkKey]: e.target.value })} placeholder={linkPh} className="ad-input !h-9 min-w-[160px] flex-1" />
            <RowTools index={i} count={list.length} onMove={L.move} onRemove={L.remove} />
          </div>
        ))}
        {!list.length ? <p className="text-[12px] text-[var(--text-muted)]">Nothing yet — this part stays empty on the site.</p> : null}
      </div>
      <button type="button" onClick={() => L.add({ name: "", [imageKey]: "", [linkKey]: "" })} className="ad-btn ad-btn--ghost ad-btn--sm mt-2">
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
};

const Section = ({ title, hint, children }) => (
  <div className="ad-card mb-4">
    <p className="text-[15px] font-extrabold text-[var(--neutral100)]">{title}</p>
    {hint ? <p className="mb-3 mt-0.5 text-[12px] text-[var(--text-muted)]">{hint}</p> : <div className="mb-3" />}
    {children}
  </div>
);

/**
 * ক্লায়েন্ট সাইটের ফুটার — প্রতিটা শিরোনাম, লেখা, মোবাইলের ছবির সারি,
 * ডেস্কটপের প্রোভাইডার লোগো আর সোশ্যাল লিংক। পাশে লাইভ প্রিভিউ।
 */
const ClientFooter = () => {
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState("");
  const [resetAsk, setResetAsk] = useState(false);

  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));
  const setTitle = (k, v) => setDraft((p) => ({ ...p, titles: { ...p.titles, [k]: v } }));

  const load = async () => {
    try {
      const { data } = await api.get(ENDPOINT);
      setDraft(pick(data?.data?.data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load");
    }
  };

  useEffect(() => {
    queueMicrotask(load);
  }, []);

  const save = async () => {
    try {
      setBusy("save");
      const { data } = await api.put(ENDPOINT, draft);
      setDraft(pick(data?.data?.data));
      toast.success("Footer saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Save failed");
    } finally {
      setBusy("");
    }
  };

  const reset = async () => {
    try {
      setBusy("reset");
      const { data } = await api.delete(ENDPOINT);
      setDraft(pick(data?.data?.data));
      toast.success("Footer is back to default");
      setResetAsk(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setBusy("");
    }
  };

  const message = useMemo(() => (draft ? { type: "tb-site:settings", settings: { footer: draft } } : null), [draft]);

  if (!draft) {
    return (
      <div className="ad-card flex items-center gap-3 text-[var(--text-muted)]">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div>
      <HistoryHeader
        title="Footer Setting"
        subtitle="Every heading, text, image and link in the client site footer. The preview shows your changes before you save."
        Icon={PanelBottom}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <Section title="Headings" hint="Mobile shows the first five, desktop the last three.">
            <div className="flex flex-col gap-3">
              {TITLES.map(([k, label]) => (
                <LangRow key={k} label={label} value={draft.titles[k]} onChange={(v) => setTitle(k, v)} />
              ))}
            </div>
          </Section>

          <Section title="Text">
            <div className="flex flex-col gap-3">
              <LangRow label="Licence text (mobile)" value={draft.licenseText} onChange={(v) => set("licenseText", v)} />
              <LangRow label="Copyright" value={draft.copyright} onChange={(v) => set("copyright", v)} />
            </div>
          </Section>

          <Section title="Mobile footer images" hint="W / H are in the 750px mobile design (0 = keep the image's own shape). Click an image to change it.">
            <div className="flex flex-col gap-3">
              {IMAGE_ROWS.map(([k, title, hint]) => (
                <ImageList key={k} title={title} hint={hint} list={draft[k]} onChange={(v) => set(k, v)} />
              ))}
            </div>
          </Section>

          <Section title="Desktop provider logos" hint="Shown in grey along the bottom of the desktop footer.">
            <NamedList list={draft.desktopProviders} onChange={(v) => set("desktopProviders", v)} imageKey="image" linkKey="link" namePh="Name" linkPh="Link (optional) https://…" addLabel="Add logo" />
          </Section>

          <Section title="Social media (desktop)" hint="Links under the social media heading; the icon is optional.">
            <NamedList list={draft.socials} onChange={(v) => set("socials", v)} imageKey="icon" linkKey="url" namePh="Name (Facebook…)" linkPh="https://…" addLabel="Add link" />
          </Section>

          <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 rounded-[16px] border border-white/[0.08] bg-[var(--neutral1000)]/90 p-3 backdrop-blur">
            <button type="button" onClick={save} disabled={Boolean(busy)} className="ad-btn ad-btn--primary flex-1">
              {busy === "save" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button type="button" onClick={() => setResetAsk(true)} disabled={Boolean(busy)} className="ad-btn ad-btn--ghost">
              <RotateCcw size={16} /> Reset to default
            </button>
          </div>
        </div>

        <div className="min-w-0 xl:sticky xl:top-4 xl:self-start">
          <SitePreview path="/" message={message} scroll="bottom" />
        </div>
      </div>

      <ConfirmModal
        open={resetAsk}
        danger
        busy={busy === "reset"}
        title="Reset the footer?"
        message="Every heading, text, image and link goes back to the site's original footer, for everyone."
        confirmText="Reset"
        onConfirm={reset}
        onClose={() => busy !== "reset" && setResetAsk(false)}
      />
    </div>
  );
};

export default ClientFooter;
