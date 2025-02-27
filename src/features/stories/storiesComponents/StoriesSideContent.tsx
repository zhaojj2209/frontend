import { Icon, Tab, TabProps, Tabs } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ControlButton from 'src/commons/ControlButton';

import GenericSideContent, {
  generateIconId,
  GenericSideContentProps
} from '../../../commons/sideContent/GenericSideContent';
import { SideContentTab, SideContentType } from '../../../commons/sideContent/SideContentTypes';
import { propsAreEqual } from '../../../commons/utils/MemoizeHelper';
import { assertType } from '../../../commons/utils/TypeHelper';
import { WorkspaceLocation } from '../../../commons/workspace/WorkspaceTypes';

export type StoriesSideContentProps = Omit<GenericSideContentProps, 'renderFunction'> & StateProps;

type StateProps = {
  selectedTabId?: SideContentType; // Optional due to uncontrolled tab component in EditingWorkspace
  renderActiveTabPanelOnly?: boolean;
};

/**
 * Adds 'side-content-tab-alert' style to newly spawned module tabs or HTML Display tab
 */
const generateClassName = (id: string | undefined) =>
  id === SideContentType.module || id === SideContentType.htmlDisplay
    ? 'side-content-tooltip side-content-tab-alert'
    : 'side-content-tooltip';

const renderTab = (
  tab: SideContentTab,
  isHidden: boolean,
  workspaceLocation?: WorkspaceLocation
) => {
  const iconSize = 20;
  const tabId = tab.id === undefined || tab.id === SideContentType.module ? tab.label : tab.id;
  const tabTitle = (
    <Tooltip2 content={tab.label}>
      <div className={generateClassName(tab.id)} id={generateIconId(tabId)}>
        <Icon icon={tab.iconName} iconSize={iconSize} />
      </div>
    </Tooltip2>
  );
  const tabProps = assertType<TabProps>()({
    id: tabId,
    title: tabTitle,
    disabled: tab.disabled,
    className: 'side-content-tab'
  });

  if (!tab.body) {
    return <Tab key={tabId} {...tabProps} />;
  }

  const tabBody: JSX.Element = workspaceLocation
    ? {
        ...tab.body,
        props: {
          ...tab.body.props,
          workspaceLocation
        }
      }
    : tab.body;
  const tabPanel: JSX.Element = <div className="side-content-text">{tabBody}</div>;

  return <Tab key={tabId} {...tabProps} panel={isHidden ? undefined : tabPanel} />;
};

// TODO: Reduce code duplication with the main SideContent component
const StoriesSideContent: React.FC<StoriesSideContentProps> = ({
  selectedTabId,
  renderActiveTabPanelOnly,
  // isHidden,
  ...otherProps
}) => {
  const [isHidden, setIsHidden] = React.useState(true);
  return (
    <GenericSideContent
      {...otherProps}
      renderFunction={(dynamicTabs, changeTabsCallback) => (
        <div className="side-content">
          <div className="side-content-tabs">
            <Tabs
              id="side-content-tabs"
              onChange={(newTabId: SideContentType, prevTabId: SideContentType, e) => {
                setIsHidden(false);
                changeTabsCallback(newTabId, prevTabId, e);
              }}
              renderActiveTabPanelOnly={renderActiveTabPanelOnly}
              selectedTabId={selectedTabId}
            >
              {dynamicTabs.map(tab => renderTab(tab, isHidden, otherProps.workspaceLocation))}
              {dynamicTabs.length ? (
                <ControlButton
                  label={isHidden ? 'Show' : 'Hide'}
                  onClick={() => setIsHidden(!isHidden)}
                  icon={isHidden ? IconNames.EYE_OPEN : IconNames.EYE_OFF}
                />
              ) : undefined}
            </Tabs>
          </div>
        </div>
      )}
    />
  );
};

export default React.memo(StoriesSideContent, propsAreEqual);
