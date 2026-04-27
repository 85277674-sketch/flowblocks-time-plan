import { CalendarDays, ChartNoAxesColumn, Focus, MoreHorizontal } from "lucide-react";

const tabs = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "focus", label: "Focus", icon: Focus },
  { id: "review", label: "Review", icon: ChartNoAxesColumn },
  { id: "more", label: "More", icon: MoreHorizontal },
];

export default function FloatingTabBar({ activeTab, onChange }) {
  return (
    <nav className="floating-tabbar" aria-label="底部导航">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isSelected = activeTab === tab.id;
        const switchTab = () => onChange(tab.id);

        return (
          <button
            key={tab.label}
            aria-current={isSelected ? "page" : undefined}
            className={isSelected ? "tab-item is-selected" : "tab-item"}
            data-tab={tab.id}
            type="button"
            onClick={switchTab}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse" || event.button === 0) {
                event.preventDefault();
                switchTab();
              }
            }}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
