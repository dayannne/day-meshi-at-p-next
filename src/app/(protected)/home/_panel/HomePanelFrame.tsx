"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useSyncExternalStore, type ReactNode } from "react";

type HomePanelFrameProps = {
  title: string;
  closeHref: string;
  children: ReactNode;
};

const MAP_OVERLAY_ROOT_ID = "map-overlay-root";

function getPortalRootSnapshot() {
  return document.getElementById(MAP_OVERLAY_ROOT_ID);
}

function getServerPortalRootSnapshot() {
  return null;
}

function subscribeToPortalRoot(onStoreChange: () => void) {
  const animationFrameId = window.requestAnimationFrame(onStoreChange);
  const observer = new MutationObserver(onStoreChange);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    window.cancelAnimationFrame(animationFrameId);
    observer.disconnect();
  };
}

export function HomePanelFrame({ title, closeHref, children }: HomePanelFrameProps) {
  const portalRoot = useSyncExternalStore(
    subscribeToPortalRoot,
    getPortalRootSnapshot,
    getServerPortalRootSnapshot
  );

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <section
      aria-label={title}
      className="pointer-events-auto absolute top-12 bottom-12 left-120 ml-6 flex w-120 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
    >
      <header className="flex h-14 flex-none items-center justify-between border-b border-slate-200 px-4">
        <h3 className="text-base font-bold text-slate-950">{title}</h3>
        <Link
          href={closeHref}
          replace
          scroll={false}
          aria-label="Close panel"
          className="mr-[-5.5px] inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
        >
          <X className="size-5" aria-hidden="true" />
        </Link>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>,
    portalRoot
  );
}
