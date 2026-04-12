import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bell,
  Shield,
  Package,
  Users,
  Stethoscope,
  BarChart2,
  UserCog,
  BellRing,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: {
    count: number;
    variant: 'default' | 'red';
  };
  children?: {
    label: string;
    path: string;
    badge?: {
      count: number;
      variant: 'default' | 'red';
    };
  }[];
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/pharmacy/dashboard',
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    icon: FileText,
    path: '/pharmacy/prescriptions',
    children: [
      { label: 'New & Pending', path: '/pharmacy/prescriptions/new', badge: { count: 3, variant: 'default' } },
      { label: 'Dispensing', path: '/pharmacy/prescriptions/dispensing' },
      { label: 'Dispensed History', path: '/pharmacy/prescriptions/dispensed' },
      { label: 'Cancelled', path: '/pharmacy/prescriptions/cancelled' },
    ],
  },
  {
    id: 'reminders',
    label: 'Patient Reminders',
    icon: Bell,
    path: '/pharmacy/reminders',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: Shield,
    path: '/pharmacy/insurance',
    children: [
      { label: 'Claims', path: '/pharmacy/insurance/claims' },
      { label: 'Pre-Authorizations', path: '/pharmacy/insurance/pre-auth' },
      { label: 'Coverage Check', path: '/pharmacy/insurance/coverage' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    path: '/pharmacy/inventory',
    badge: { count: 1, variant: 'red' },
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: Users,
    path: '/pharmacy/patients',
  },
  {
    id: 'doctors',
    label: 'Doctors & Clinics',
    icon: Stethoscope,
    path: '/pharmacy/doctors',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart2,
    path: '/pharmacy/reports',
  },
  {
    id: 'staff',
    label: 'Staff Management',
    icon: UserCog,
    path: '/pharmacy/staff',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: BellRing,
    path: '/pharmacy/notifications',
    badge: { count: 5, variant: 'red' },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/pharmacy/settings',
  },
];

export default function PharmacySidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('pharmacy_sidebar_collapsed');
    return saved === 'true';
  });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('pharmacy_sidebar_collapsed', collapsed.toString());
  }, [collapsed]);

  useEffect(() => {
    const newExpanded = new Set<string>();
    navigationItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => isActive(child.path));
        if (isChildActive) {
          newExpanded.add(item.id);
        }
      }
    });
    setExpandedItems(newExpanded);
  }, [location.pathname]);

  const isActive = (path: string): boolean => {
    if (path === '/pharmacy/dashboard') {
      return location.pathname === '/pharmacy/dashboard' || location.pathname === '/pharmacy';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavigation = (item: NavItem) => {
    if (item.children && !collapsed) {
      toggleExpand(item.id);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div
      className={`bg-slate-800 text-white transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{ backgroundColor: '#1E293B' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm">
              Rx
            </div>
            <span className="font-semibold text-sm">Pharmacy Portal</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const isParentActive = hasChildren && item.children.some(child => isActive(child.path));

          return (
            <div key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all relative group ${
                  active || isParentActive
                    ? 'text-emerald-400 bg-emerald-950 bg-opacity-30'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {(active || isParentActive) && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500"></div>
                )}

                <Icon className="w-5 h-5 flex-shrink-0" />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.badge.variant === 'red'
                            ? 'bg-red-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {item.badge.count}
                      </span>
                    )}

                    {hasChildren && (
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </>
                )}

                {collapsed && item.badge && (
                  <div className="absolute top-2 right-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.badge.variant === 'red' ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                    ></div>
                  </div>
                )}
              </button>

              {hasChildren && isExpanded && !collapsed && (
                <div className="bg-slate-900 bg-opacity-30">
                  {item.children!.map((child) => {
                    const childActive = isActive(child.path);

                    return (
                      <button
                        key={child.path}
                        onClick={() => navigate(child.path)}
                        className={`w-full flex items-center gap-3 px-4 pl-12 py-2.5 text-sm transition-all relative ${
                          childActive
                            ? 'text-emerald-400 bg-emerald-950 bg-opacity-20'
                            : 'text-gray-400 hover:bg-slate-700 hover:text-gray-200'
                        }`}
                      >
                        {childActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500"></div>
                        )}

                        <span className="flex-1 text-left">{child.label}</span>

                        {child.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                              child.badge.variant === 'red'
                                ? 'bg-red-500 text-white'
                                : 'bg-emerald-500 text-white'
                            }`}
                          >
                            {child.badge.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
