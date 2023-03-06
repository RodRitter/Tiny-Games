import { Container } from "pixi.js";

export default class PixiECS {
  constructor(app) {
    this.app = app;
    this.entities = [];
    this.components = [];
    this.systems = [];
    this.started = false;
  }

  addEntity(entity) {
    entity.ecs = this;
    this.entities.push(entity);
    this.onReady();
  }

  addComponent(component) {
    component.ecs = this;
    this.components.push(component);
  }

  addSystem(system) {
    system.ecs = this;
    this.systems.push(system);
    if (this.started) system.onReady();
  }

  getComponent(compare) {
    const _component = this.components.filter(
      (c) => c.constructor.name === compare.name
    );

    return _component[0];
  }

  getEntity(compare) {
    const _entity = this.entities.filter(
      (c) => c.constructor.name === compare.name
    );

    return _entity[0];
  }

  getSystem(compare) {
    const _system = this.systems.filter(
      (c) => c.constructor.name === compare.name
    );

    return _system[0];
  }

  onReady() {
    this.systems.forEach((sys) => sys.onReady());
    this.started = true;
  }

  update(context) {
    this.systems.forEach((system) => system.update(context));
  }

  tick(context) {
    this.systems.forEach((system) => system.tick(context));
  }
}

export class Entity {
  constructor() {
    this.components = [];
  }

  addComponent(component) {
    component.entity = this;
    this.components.push(component);
  }

  getComponent(compare) {
    const _component = this.components.filter(
      (c) => c.constructor.name === compare.name
    );

    return _component[0];
  }

  getComponents(components) {
    const _components = this.components.filter((c) => {
      const compareNames = components.map((c) => c.name);
      return compareNames.includes(c.constructor.name);
    });

    return _components;
  }

  onDestroy() {}

  destroy() {
    this.onDestroy();
    this.components.forEach((component) => component.onDestroy());

    this.ecs.entities.forEach((entity, index) => {
      if (entity === this) {
        delete this.ecs.entities[index];
      }
    });
  }
}

export class Component {
  constructor() {
    this.entity = null;
  }

  onDestroy() {}
}

export class System {
  constructor() {}

  getEntities() {
    return this.ecs?.entities;
  }

  getEntitiesByType(type) {
    const _entities = this.ecs.entities.filter(
      (c) => c.constructor.name === type.name
    );

    return _entities;
  }

  getEntitiesWithComponent(component) {
    const _entities = this.ecs.entities.filter((entity) => {
      const _component = entity.getComponent(component);
      if (_component) {
        return _component;
      }
      return false;
    });
    return _entities;
  }

  getEntitiesWithComponents(components) {
    const _entities = this.ecs.entities.filter((entity) => {
      const compareNames = components.map((c) => c.name);
      const componentNames = entity.components.map((c) => c.constructor.name);

      let matches = 0;
      compareNames.forEach((compare) => {
        if (componentNames.includes(compare)) matches += 1;
      });

      return matches === components.length;
    });

    return _entities;
  }

  getComponents(componentType) {
    const _components = [];
    const _entities = this.getEntitiesWithComponent(componentType);
    _entities.forEach((_entity) => {
      const _component = _entity.getComponent(componentType);
      if (_component) {
        _components.push(_component);
      }
    });

    return _components;
  }

  onReady() {}

  update(context) {}

  tick(context) {}
}
