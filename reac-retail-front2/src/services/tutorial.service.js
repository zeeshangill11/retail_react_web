import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("http://localhost:8082/api/1.0.0/cronjob/test22");
  }

  get(id) {
    return http.get(`http://localhost:8082/api/1.0.0/cronjob/test22/${id}`);
  }

  create(data) {
    return http.post("http://localhost:8082/api/1.0.0/cronjob/test22", data);
  }

  update(id, data) {
    return http.put(`http://localhost:8082/api/1.0.0/cronjob/test22/${id}`, data);
  }

  delete(id) {
    return http.delete(`http://localhost:8082/api/1.0.0/cronjob/test22/${id}`);
  }

  deleteAll() {
    return http.delete(`http://localhost:8082/api/1.0.0/cronjob/test22`);
  }

  findByTitle(title) {
    return http.get(`http://localhost:8082/api/1.0.0/cronjob/test22?title=${title}`);
  }
}

export default new TutorialDataService();