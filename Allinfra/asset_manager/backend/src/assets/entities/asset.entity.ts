import { Entity, Column, ObjectIdColumn } from 'typeorm';
// import * as crypto from 'crypto';

@Entity('assets')
export class Assets {

    @ObjectIdColumn()
    _id: string;

    @Column()
    serial: string;

    @Column()
    type: string;

    @Column()
    color: string;

    // @BeforeInsert()
    // hashMetaData() {
    //     this.meta = crypto.createHmac('sha256', this.meta).digest('hex');
    // }
    @Column()
    metadata: object;

	@Column()
	createdAt: number
    
	@Column()
	updatedAt: number

    constructor(partial: Assets) {
		if (partial) {
			Object.assign(this, partial)
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}