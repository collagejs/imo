import { createContext } from "svelte";

export interface TabsContext {
    tabsId: string | number;
    activeTabId?: string | number | undefined;
    tabs: (string | number)[];
};

export class TabsContextImpl implements TabsContext {
    tabsId;
    activeTabId;
    tabs;
    constructor(id: string | number) {
        this.tabsId = $state(id);
        this.activeTabId = $state<TabsContext['activeTabId']>(undefined);
        this.tabs = $state<TabsContext['tabs']>([]);
    }
}

export const [getTabsContext, setTabsContext] = createContext<TabsContext>();
