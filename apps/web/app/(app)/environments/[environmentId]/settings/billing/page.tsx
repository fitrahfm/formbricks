export const revalidate = REVALIDATION_INTERVAL;

import { REVALIDATION_INTERVAL } from "@formbricks/lib/constants";
import { IS_FORMBRICKS_CLOUD } from "@formbricks/lib/constants";

import { authOptions } from "@formbricks/lib/authOptions";
import { getTeamByEnvironmentId } from "@formbricks/lib/team/service";
import { getMembershipByUserIdTeamId } from "@formbricks/lib/membership/service";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import SettingsTitle from "../components/SettingsTitle";
import PricingTable from "./components/PricingTable";
import { ErrorComponent } from "@formbricks/ui/ErrorComponent";

export default async function ProfileSettingsPage({ params }) {
  if (!IS_FORMBRICKS_CLOUD) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const team = await getTeamByEnvironmentId(params.environmentId);

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const isPricingDisabled =
    currentUserMembership?.role !== "owner" ? currentUserMembership?.role !== "admin" : false;

  return (
    <>
      <div>
        <SettingsTitle title="Billing & Plan" />
        {!isPricingDisabled ? <PricingTable team={team} /> : <ErrorComponent />}
      </div>
    </>
  );
}
