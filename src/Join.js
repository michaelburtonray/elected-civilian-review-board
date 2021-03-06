/* global FB */
import React, { Component } from "react";
import ContentfulClient from "./ContentfulClient";
import EcrbSlideshow from "./EcrbSlideshow";
import "./join.css";
import Section from "./Section";
import { markdown } from "markdown";

class Join extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      sliderSlides: [],
      subtitle: "",
      intro: "",
      sections: [],
      events: [],
    };
  }

  componentDidMount() {
    const contentfulClient = new ContentfulClient();

    contentfulClient
      .getJoin()
      .then(response => {
        return response.items[0];
      })
      .then(data => {
        const { title, subtitle } = data.fields;
        const intro = markdown.toHTML(data.fields.intro);

        const sections = data.fields.sections.map(section => {
          const heading = section.fields.heading;
          const content = markdown.toHTML(section.fields.content);
          return { heading, content };
        });

        const sliderSlides = data.fields.sliderSlides;

        this.setState({ title, subtitle, intro, sections, sliderSlides });
      });

    contentfulClient.getJoinPageSlides().then(response => {
      const data = response.items[0];
      const sliderSlides = data.fields.slides;
      this.setState({ sliderSlides });
    });

    window.fbAsyncInit = () => {
      FB.init({
        appId: "1822632521322919",
        xfbml: true,
        version: "v2.8",
      });
      FB.AppEvents.logPageView();

      const date_now = Date.now();

      FB.api(
        "/HoldPoliceAccountableNYC/events",
        "GET",
        {
          access_token: "1822632521322919|b17e6b343ca31c330d1912613961f381",
        },
        response => {
          const events = response.data.filter(
            event => new Date(event.start_time) > date_now
          );
          this.setState({ events });
        }
      );
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      // js.src = "//connect.facebook.net/en_US/sdk/debug.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  render() {
    return (
      <div className="join-page">
        <EcrbSlideshow
          slicksettings={this.slicksettings}
          sliderSlides={this.state.sliderSlides}
        />

        <h1>{this.state.title}</h1>
        <h3>{this.state.subtitle}</h3>
        <div
          className="join-page__intro"
          dangerouslySetInnerHTML={{ __html: this.state.intro }}
        />

        {this.state.sections.map((section, idx) => (
          <Section {...section} key={idx} />
        ))}
      </div>
    );
  }
}

export default Join;
