class SampleModel {
  userId;
  id;
  title;
  completed;
  constructor(
    userId?: number,
    id?: number,
    title?: string,
    completed?: boolean,
  ) {
    this.userId = userId;
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}

export default SampleModel;
