import {
  ConfigPlugin,
  withXcodeProject,
  withAndroidManifest,
} from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

const withWidgets: ConfigPlugin = (config) => {
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

  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest as any;
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

export default withWidgets;
