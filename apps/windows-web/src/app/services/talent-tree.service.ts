import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TalentTreeResponse } from '../apps/talent-tree/talent-tree';

@Injectable({
  providedIn: 'root'
})
export class TalentTreeService {

  constructor(private httpClient: HttpClient) { }

  getTalentTree(clazz: string, spec: string) {
    return firstValueFrom(this.httpClient.get<TalentTreeResponse>(`/api/talents/${clazz}/${spec}`));
  }
}
