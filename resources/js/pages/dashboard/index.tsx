import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
  Database,
} from "lucide-react";
import useImport from "@/hooks/use-import";
import PageTitle from "@/components/shared/page-header";
import StationCard from "./components/station-card";
import DashboardLayout from "@/layouts/dashboard-layout";

export default function Dashboard({ stations }: { stations: Array<any>; }) {
  const { t } = useImport()
  return (
    <DashboardLayout>
      <Head title="Dashboard — AquaRO" />

      <div className="container mx-auto ">

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