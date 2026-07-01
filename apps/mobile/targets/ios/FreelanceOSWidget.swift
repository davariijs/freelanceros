import WidgetKit
import SwiftUI

struct SharedTask: Codable, Identifiable {
    let id: String
    let title: String
    let priority: String
}

struct TaskEntry: TimelineEntry {
    let date: Date
    let tasks: [SharedTask]
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> TaskEntry {
        TaskEntry(date: Date(), tasks: [
            SharedTask(id: "1", title: "Refactor database pool", priority: "HIGH"),
            SharedTask(id: "2", title: "Client onboarding call", priority: "MEDIUM")
        ])
    }

    func getSnapshot(in context: Context, completion: @escaping (TaskEntry) -> ()) {
        let entry = TaskEntry(date: Date(), tasks: fetchTasksFromSharedStorage())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let entry = TaskEntry(date: Date(), tasks: fetchTasksFromSharedStorage())
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }

    private func fetchTasksFromSharedStorage() -> [SharedTask] {
        guard let sharedDefaults = UserDefaults(suiteName: "group.com.freelanceos.mobile"),
            let rawJson = sharedDefaults.string(forKey: "today_tasks_json") else {
            return []
        }
        do {
            let data = Data(rawJson.utf8)
            return try JSONDecoder().decode([SharedTask].self, from: data)
        } catch {
            return []
        }
    }
}

struct FreelanceOSWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VBox(alignment: .leading, spacing: 10) {
            HStack {
                Text("FOS Focus")
                    .font(.caption)
                    .fontWeight(.black)
                    .foregroundColor(.gray)
                Spacer()
                Image(systemName: "clock.fill")
                    .font(.caption2)
                    .foregroundColor(.amber)
            }
            if entry.tasks.isEmpty {
                Text("No priority tasks today.")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .frame(maxHeight: .infinity)
            } else {
                VBox(alignment: .leading, spacing: 8) {
                    ForEach(entry.tasks.prefix(3)) { task in
                        Link(destination: URL(string: "freelanceos://tasks/\(task.id)")!) {
                            HStack(spacing: 8) {
                                Image(systemName: "circle")
                                    .font(.caption2)
                                    .foregroundColor(.gray)
                                Text(task.title)
                                    .font(.caption2)
                                    .fontWeight(.semibold)
                                    .lineLimit(1)
                                Spacer()
                                Text(task.priority)
                                    .font(.system(size: 8, weight: .bold))
                                    .padding(.horizontal, 5)
                                    .padding(.vertical, 2)
                                    .background(Color.red.opacity(0.1))
                                    .foregroundColor(.red)
                                    .cornerRadius(3)
                            }
                        }
                    }
                }
            }
            Spacer()
        }
        .padding()
        .background(Color(red: 10/255, green: 10/255, blue: 10/255))
    }
}

@main
struct FreelanceOSWidget: Widget {
    let kind: String = "FreelanceOSWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            FreelanceOSWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Today's Focus")
        .description("View and manage your priority tasks instantly.")
        .supportedFamilies([.systemMedium])
    }
}