const {
  withXcodeProject,
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withWidgets = (config) => {
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const targetPath = path.join(
      config.modRequest.projectRoot,
      "targets/ios/FreelanceOSWidget.swift",
    );

    if (fs.existsSync(targetPath)) {
      const widgetGroup = project.addPbxGroup(
        ["FreelanceOSWidget.swift"],
        "FreelanceOSWidget",
        "FreelanceOSWidget",
      );
      project.addTarget(
        "FreelanceOSWidget",
        "app_extension",
        "FreelanceOSWidget",
      );
    }
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const packageName = config.android?.package || "com.freeos.mobile";
      const packagePath = packageName.replace(/\./g, "/");

      const resDir = path.join(projectRoot, "android/app/src/main/res");
      const xmlDir = path.join(resDir, "xml");
      const layoutDir = path.join(resDir, "layout");
      const widgetDir = path.join(
        projectRoot,
        "android/app/src/main/java",
        packagePath,
      );
      const mainAppPath = path.join(
        projectRoot,
        "android/app/src/main/java",
        packagePath,
        "MainApplication.kt",
      );

      if (!fs.existsSync(xmlDir)) fs.mkdirSync(xmlDir, { recursive: true });
      if (!fs.existsSync(layoutDir))
        fs.mkdirSync(layoutDir, { recursive: true });
      if (!fs.existsSync(widgetDir))
        fs.mkdirSync(widgetDir, { recursive: true });

      if (fs.existsSync(mainAppPath)) {
        let content = fs.readFileSync(mainAppPath, "utf8");
        if (
          content.includes("PackageList(this).packages") &&
          !content.includes("WidgetUpdatePackage()")
        ) {
          content = content.replace(
            "PackageList(this).packages.apply {",
            "PackageList(this).packages.apply {\n            add(WidgetUpdatePackage())",
          );
          fs.writeFileSync(mainAppPath, content, "utf8");
        }
      }

      const widgetInfoXml = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android" android:minWidth="110dp" android:minHeight="110dp" android:updatePeriodMillis="86400000" android:initialLayout="@layout/widget_layout" android:targetCellWidth="2" android:targetCellHeight="2" android:resizeMode="horizontal|vertical" android:widgetCategory="home_screen"></appwidget-provider>`;
      fs.writeFileSync(path.join(xmlDir, "widget_info.xml"), widgetInfoXml);

      const widgetLayoutXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical" android:padding="12dp" android:background="#0a0a0a">
    <RelativeLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:gravity="center_vertical">
        <TextView android:id="@+id/widget_title" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="FOS Today" android:textColor="#737373" android:textSize="11sp" android:textStyle="bold" android:layout_alignParentStart="true" android:layout_centerVertical="true" />
        <Button android:id="@+id/btn_quick_add" android:layout_width="28dp" android:layout_height="28dp" android:text="+" android:textSize="12sp" android:textColor="#0a0a0a" android:backgroundTint="#FFFFFF" android:padding="0dp" android:insetTop="0dp" android:insetBottom="0dp" android:layout_alignParentEnd="true" android:layout_centerVertical="true" />
    </RelativeLayout>
    <TextView android:id="@+id/widget_task_title" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="10dp" android:text="No tasks available today." android:textColor="#FFFFFF" android:textSize="12sp" android:lineSpacingExtra="3dp" />
</LinearLayout>`;
      fs.writeFileSync(
        path.join(layoutDir, "widget_layout.xml"),
        widgetLayoutXml,
      );

      const widgetCode = `
package ${packageName}

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import org.json.JSONArray

class FreelanceOSWidget : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_layout)

            try {
                val sharedPref = context.getSharedPreferences("group.com.freeos.mobile", Context.MODE_PRIVATE)
                val rawJson = sharedPref.getString("today_tasks_json", "[]")
                val tasksArray = JSONArray(rawJson)
                if (tasksArray.length() > 0) {
                    val tasksText = StringBuilder()
                    val maxCount = minOf(tasksArray.length(), 3)
                    for (i in 0 until maxCount) {
                        val task = tasksArray.getJSONObject(i)
                        tasksText.append("• ").append(task.getString("title")).append("\\n")
                    }
                    views.setTextViewText(R.id.widget_task_title, tasksText.toString().trim())
                } else {
                    views.setTextViewText(R.id.widget_task_title, "No tasks available today.")
                }
            } catch (e: Exception) {
                views.setTextViewText(R.id.widget_task_title, "Loading...")
            }

            val quickAddIntent = Intent(Intent.ACTION_VIEW, Uri.parse("freelanceos://home"))
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                quickAddIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_quick_add, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
`;
      fs.writeFileSync(
        path.join(widgetDir, "FreelanceOSWidget.kt"),
        widgetCode,
      );

      const moduleCode = `
package ${packageName}

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WidgetUpdateModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "WidgetUpdateModule"
    }

    @ReactMethod
    fun updateWidget() {
        val context = reactApplicationContext
        val intent = Intent(context, FreelanceOSWidget::class.java).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        }
        val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(ComponentName(context, FreelanceOSWidget::class.java))
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        context.sendBroadcast(intent)
    }
}
`;
      fs.writeFileSync(
        path.join(widgetDir, "WidgetUpdateModule.kt"),
        moduleCode,
      );

      const packageCode = `
package ${packageName}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class WidgetUpdatePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(WidgetUpdateModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
`;
      fs.writeFileSync(
        path.join(widgetDir, "WidgetUpdatePackage.kt"),
        packageCode,
      );

      return config;
    },
  ]);

  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;
    const application = androidManifest.application?.[0];

    if (application) {
      if (!application.receiver) {
        application.receiver = [];
      }

      application.receiver.push({
        $: {
          "android:name": ".FreelanceOSWidget",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name": "android.appwidget.action.APPWIDGET_UPDATE",
                },
              },
            ],
          },
        ],
        "meta-data": [
          {
            $: {
              "android:name": "android.appwidget.provider",
              "android:resource": "@xml/widget_info",
            },
          },
        ],
      });
    }
    return config;
  });

  return config;
};

module.exports = withWidgets;
