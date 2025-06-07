
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">דוחות</h1>
        </div>
      </header>
      
      <div className="p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-right">דוחות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              עמוד זה יכלול דוחות מפורטים על פעילות הנהגים והמסלולים.
              <br />
              בעתיד ניתן יהיה לצפות בדוחות ביצועים, דוחות זמנים ודוחות מרחק.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
