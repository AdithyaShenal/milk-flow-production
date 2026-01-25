import "leaflet-routing-machine";

declare module "leaflet" {
  namespace Routing {
    function control(options?);
    function osrmv1(options);
    function mapbox(token: string, options?);
  }

  let Routing: typeof Routing;
}
