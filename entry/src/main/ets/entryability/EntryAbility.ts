import { UIAbility } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    console.info('EntryAbility onCreate');
  }

  onDestroy() {
    console.info('EntryAbility onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        console.error('loadContent failed: ' + JSON.stringify(err));
        return;
      }
      console.info('loadContent succeeded');
    });
  }

  onWindowStageDestroy() {
    console.info('EntryAbility onWindowStageDestroy');
  }

  onForeground() {
    console.info('EntryAbility onForeground');
  }

  onBackground() {
    console.info('EntryAbility onBackground');
  }
}
