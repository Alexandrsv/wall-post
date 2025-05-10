import { useVkWizard } from "~/hooks/useVkWizard";
import { StepAuth } from "./StepAuth";
import { StepSelectGroup } from "./StepSelectGroup";
import { StepGroupToken } from "./StepGroupToken";
import { StepCallbackSetup } from "./StepCallbackSetup";
import { StepSuccess } from "./StepSuccess";

export function Wizard() {
  const wizard = useVkWizard();

  switch (wizard.step) {
    case "auth":
      return (
        <StepAuth
          onAuth={wizard.handleAuth}
          loading={wizard.loading}
          error={wizard.error}
        />
      );
    case "selectGroup":
      return (
        <StepSelectGroup
          groups={wizard.groups}
          onSelect={(g) => {
            wizard.setSelectedGroup(g);
            wizard.setStep("groupToken");
          }}
          onRefresh={wizard.fetchGroups}
          loading={wizard.loading}
          error={wizard.error}
        />
      );
    case "groupToken":
      return (
        wizard.selectedGroup && (
          <StepGroupToken
            group={wizard.selectedGroup}
            onGetToken={wizard.handleGetCommunityToken}
            loading={wizard.loading}
            error={wizard.error}
          />
        )
      );
    case "callbackSetup":
      return (
        <StepCallbackSetup
          onSetup={wizard.handleSetupCallback}
          loading={wizard.loading}
          error={wizard.error}
        />
      );
    case "success":
      return <StepSuccess />;
    default:
      return null;
  }
}
