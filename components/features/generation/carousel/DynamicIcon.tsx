import React from 'react';
import { 
  Quote, MessageCircle, Heart, Repeat, Share, CheckCircle, Terminal, 
  ArrowRight, XCircle, User, Image, Star, Zap, TrendingUp, DollarSign,
  Briefcase, Lightbulb, Target, Award, Book, Coffee, Rocket, Users,
  Globe, Megaphone, Smartphone, Laptop, Mail, Link, Lock, Unlock,
  Search, Bell, Calendar, Clock, MapPin, Home, Settings, Edit, Trash,
  Plus, Minus, Hash, AtSign, Percent, AlertCircle, AlertTriangle, Info,
  Check, X, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Play, Pause, Volume2, VolumeX, Video, Music, Mic, Camera
} from 'lucide-react';
import { LucideProps } from 'lucide-react';

export const iconMap: Record<string, React.FC<LucideProps>> = {
  'quote': Quote,
  'message-circle': MessageCircle,
  'heart': Heart,
  'repeat': Repeat,
  'share': Share,
  'check-circle': CheckCircle,
  'terminal': Terminal,
  'arrow-right': ArrowRight,
  'x-circle': XCircle,
  'user': User,
  'image': Image,
  'star': Star,
  'zap': Zap,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  'briefcase': Briefcase,
  'lightbulb': Lightbulb,
  'target': Target,
  'award': Award,
  'book': Book,
  'coffee': Coffee,
  'rocket': Rocket,
  'users': Users,
  'globe': Globe,
  'megaphone': Megaphone,
  'smartphone': Smartphone,
  'laptop': Laptop,
  'mail': Mail,
  'link': Link,
  'lock': Lock,
  'unlock': Unlock,
  'search': Search,
  'bell': Bell,
  'calendar': Calendar,
  'clock': Clock,
  'map-pin': MapPin,
  'home': Home,
  'settings': Settings,
  'edit': Edit,
  'trash': Trash,
  'plus': Plus,
  'minus': Minus,
  'hash': Hash,
  'at-sign': AtSign,
  'percent': Percent,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'check': Check,
  'x': X,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'play': Play,
  'pause': Pause,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  'video': Video,
  'music': Music,
  'mic': Mic,
  'camera': Camera
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || iconMap['star']; // Fallback to star
  return <IconComponent {...props} />;
};
