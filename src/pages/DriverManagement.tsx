
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DriverManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">ניהול נהגים</h1>
        </div>
      </header>
      
      <div className="p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-right">ניהול נהגים</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              עמוד זה יכלול פונקציונליות לניהול נהגים במערכת.
              <br />
              בעתיד ניתן יהיה להוסיף, לערוך ולמחוק נהגים מהמערכת.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverManagement;
