import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  // baseUrl
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  updateStory(story: any) {
    return this.http.put(this.baseUrl + '/stories/' + story.id, story, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }
}
