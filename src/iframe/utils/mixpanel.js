import * as mixpanel from "mixpanel-browser";

const mixpanelToken ="bfd2914a8e0f90147f5d2c1d324c660f";
mixpanel.init(mixpanelToken, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

let actions = {
  track: (eventName, properties = {}, auth, distinctId) => {
    const data = {
            token: mixpanelToken,
            distinct_id: distinctId,
            environment: "Production",
            ...properties,
    };
    if (auth) {
        data.auth = auth;
    }
    mixpanel.track(eventName, {...data})
  },
};

export let Mixpanel = actions;
