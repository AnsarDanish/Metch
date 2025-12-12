import React from "react";

import { Badge, BookOpen, Calendar, Clock, FileText, MapPin, Star, Trophy, Users } from "lucide-react";

export default function EventsPage() {

      const upcomingEvents = [
    {
      title: "Annual Sports Day",
      date: "2025-09-15",
      time: "9:00 AM",
      venue: "School Ground",
      type: "sports",
    },
    {
      title: "Parent-Teacher Meeting",
      date: "2025-09-08",
      time: "2:00 PM",
      venue: "Main Hall",
      type: "meeting",
    },
    {
      title: "Science Exhibition",
      date: "2025-09-22",
      time: "10:00 AM",
      venue: "Science Lab",
      type: "academic",
    },
    {
      title: "Cultural Program",
      date: "2025-10-02",
      time: "6:00 PM",
      venue: "Auditorium",
      type: "cultural",
    },
  ];

  return (
 <div className="space-y-6">
  Hello
      {/* <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        event.type === "sports"
                          ? "bg-blue-100 text-blue-600"
                          : event.type === "meeting"
                          ? "bg-green-100 text-green-600"
                          : event.type === "academic"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {event.type === "sports" ? (
                        <Trophy className="w-5 h-5" />
                      ) : event.type === "meeting" ? (
                        <Users className="w-5 h-5" />
                      ) : event.type === "academic" ? (
                        <BookOpen className="w-5 h-5" />
                      ) : (
                        <Star className="w-5 h-5" />
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        event.type === "sports"
                          ? "border-blue-200 text-blue-800"
                          : event.type === "meeting"
                          ? "border-green-200 text-green-800"
                          : event.type === "academic"
                          ? "border-purple-200 text-purple-800"
                          : "border-orange-200 text-orange-800"
                      }
                    >
                      {event.type.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-3">
                    {event.title}
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString("en-IN")}
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
