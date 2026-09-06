'use client';

import {
  House, ClipboardCheck, Terminal, Landmark, ChartLine, ChartColumn, Banknote,
  ArrowRightLeft, CreditCard, Users, Receipt, ShieldCheck, Send, FileText,
  UsersRound, FileSignature, ArrowDownToLine, Signature, Wallet, MailOpen,
  Repeat, BookOpen, Columns3, Settings, Gift, Grid2x2, Bookmark, Search, Plus,
  ChevronDown, ChevronRight, ChevronLeft, Ellipsis, EllipsisVertical, X, Check,
  Eye, EyeOff, Bell, TrendingUp, TrendingDown, Upload, FileUp, Filter, Star,
  CircleCheck, CircleAlert, Info, TriangleAlert, Copy, Pencil, Trash2,
  ArrowUpRight, ArrowDownRight, ArrowRight, ArrowLeft, Calendar, Clock,
  Sparkles, Table, Tag, Lock, Key, Link as LinkIcon, MessageSquare, Percent,
  Sun, Moon, Monitor, Smartphone, Fingerprint, Menu, Utensils, RotateCcw,
  type LucideIcon,
} from 'lucide-react';

/**
 * The original uses Font Awesome Pro, which is licensed and cannot be
 * redistributed. Lucide is the free stand-in; names are mapped from the
 * `data-icon` values scraped off the reference interface (147 unique icons).
 */
const MAP: Record<string, LucideIcon> = {
  house: House, 'clipboard-check': ClipboardCheck, terminal: Terminal,
  'building-columns': Landmark, 'chart-line': ChartLine, 'chart-column': ChartColumn,
  'money-bill-wave': Banknote, 'right-left': ArrowRightLeft,
  'arrow-right-arrow-left': ArrowRightLeft, 'credit-card': CreditCard,
  users: Users, 'user-group-simple': UsersRound, receipt: Receipt,
  'shield-check': ShieldCheck, 'paper-plane': Send, 'file-lines': FileText,
  'file-invoice-dollar': FileSignature, 'file-contract': FileText,
  'arrow-down-to-line': ArrowDownToLine, signature: Signature,
  'money-check': Wallet, 'envelope-open-dollar': MailOpen, repeat: Repeat,
  books: BookOpen, 'book-open': BookOpen, 'table-columns': Columns3,
  gear: Settings, gift: Gift, 'grid-2': Grid2x2, bookmark: Bookmark,
  'magnifying-glass': Search, plus: Plus, 'chevron-down': ChevronDown,
  'chevron-right': ChevronRight, 'chevron-left': ChevronLeft,
  ellipsis: Ellipsis, 'ellipsis-vertical': EllipsisVertical, xmark: X,
  check: Check, eye: Eye, 'eye-slash': EyeOff, bell: Bell,
  'arrow-trend-up': TrendingUp, 'arrow-trend-down': TrendingDown,
  upload: Upload, 'file-arrow-up': FileUp, filter: Filter, star: Star,
  'circle-check': CircleCheck, 'circle-exclamation': CircleAlert,
  'circle-info': Info, 'triangle-exclamation': TriangleAlert, copy: Copy,
  pencil: Pencil, 'pen-to-square': Pencil, 'trash-can': Trash2, trash: Trash2,
  'arrow-up-right': ArrowUpRight, 'arrow-down-right': ArrowDownRight,
  'arrow-right': ArrowRight, 'arrow-left': ArrowLeft, calendar: Calendar,
  clock: Clock, sparkles: Sparkles, table: Table, tag: Tag, lock: Lock,
  key: Key, link: LinkIcon, 'message-lines': MessageSquare,
  'circle-dollar': Percent,
  sun: Sun, moon: Moon, computer: Monitor, 'bars-filter': Menu, bars: Menu,
  utensils: Utensils, 'arrow-rotate-left': RotateCcw,
  'mobile-screen': Smartphone, fingerprint: Fingerprint,
};

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 16, className, strokeWidth = 1.75, style }: IconProps) {
  const C = MAP[name] ?? CircleAlert;
  return <C size={size} className={className} strokeWidth={strokeWidth} style={style} aria-hidden />;
}
