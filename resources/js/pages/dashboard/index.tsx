import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
  Building2,
  Droplets,
  ArrowRight,
  MapPin,
  Database,
} from "lucide-react";

import { DashboardLayout } from "./components/DashboardLayout";
import useImport from "@/hooks/use-import";
import PageTitle from "@/components/shared/page-title";
import StationCard from "./components/station-card";

export default function Dashboard({
  stations,
}: {
  stations: Array<any>;
}) {
  const { t } = useImport()
  return (
    <DashboardLayout>
      <Head title="Dashboard — AquaRO" />

      <div className="space-y-8 container mx-auto px-5 py-10">

        <PageTitle
          icon={<Database />}
          title={t("dashboard.all-stations")}
          subtitle={t("dashboard.manage-dashboard")}
        />
       

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}