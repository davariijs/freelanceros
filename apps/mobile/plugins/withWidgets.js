const {
  withXcodeProject,
  withAndroidManifest,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withWidgets = (config) => {
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const projectRoot = config.modRequest.projectRoot;

    const iosDir = path.join(projectRoot, "ios/FreelanceOSWidget");
    const sourceSwift = path.join(
      projectRoot,
      "targets/ios/FreelanceOSWidget.swift",
    );

    if (fs.existsSync(sourceSwift)) {
      if (!fs.existsSync(iosDir)) {
        fs.mkdirSync(iosDir, { recursive: true });
      }
      fs.copyFileSync(
        sourceSwift,
        path.join(iosDir, "FreelanceOSWidget.swift"),
      );

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

  config = withAndroidManifest(config, (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const androidManifest = config.modResults.manifest;
    const application = androidManifest.application?.[0];

    const resXmlDir = path.join(projectRoot, "android/app/src/main/res/xml");
    const resLayoutDir = path.join(
      projectRoot,
      "android/app/src/main/res/layout",
    );
    const javaPackageDir = path.join(
      projectRoot,
      "android/app/src/main/java/com/freelanceos/mobile",
    );

    const sourceKotlin = path.join(
      projectRoot,
      "targets/android/FreelanceOSWidget.kt",
    );

    if (!fs.existsSync(resXmlDir)) fs.mkdirSync(resXmlDir, { recursive: true });
    if (!fs.existsSync(resLayoutDir))
      fs.mkdirSync(resLayoutDir, { recursive: true });
    if (!fs.existsSync(javaPackageDir))
      fs.mkdirSync(javaPackageDir, { recursive: true });

    if (fs.existsSync(sourceKotlin)) {
      fs.copyFileSync(
        sourceKotlin,
        path.join(javaPackageDir, "FreelanceOSWidget.kt"),
      );
    }

    const widgetInfoXml = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="110dp"
    android:updatePeriodMillis="86400000"
    android:initialLayout="@layout/widget_layout"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen">
</appwidget-provider>`;
    fs.writeFileSync(path.join(resXmlDir, "widget_info.xml"), widgetInfoXml);

    const widgetLayoutXml = `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="8dp"
    android:background="#0a0a0a">

    <TextView
        android:id="@+id/widget_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="FOS Today"
        android:textColor="#ffffff"
        android:textStyle="bold"
        android:textSize="12sp"
        android:layout_alignParentLeft="true" />

    <Button
        android:id="@+id/btn_quick_add"
        android:layout_width="32dp"
        android:layout_height="32dp"
        android:text="+"
        android:textColor="#0a0a0a"
        android:background="#ffffff"
        android:layout_alignParentRight="true" />

    <TextView
        android:id="@+id/widget_task_list"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_below="@id/widget_title"
        android:layout_marginTop="8dp"
        android:text="No tasks available today."
        android:textColor="#a3a3a3"
        android:textSize="10sp" />
</RelativeLayout>`;
    fs.writeFileSync(
      path.join(resLayoutDir, "widget_layout.xml"),
      widgetLayoutXml,
    );

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
